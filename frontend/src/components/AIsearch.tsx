import { useState } from "react";
import axios from "axios";

// API 응답 데이터 타입 (예제 응답 기준)
export type ContentData = {
    contentId: number;
    postNumber: string;
    title: string;
    url: string;
    createdAt: string;
    views: number;
    likes: number;
    category: string;
    location: string | null;
    latitude: string | null;
    longitude: string | null;
    hashtags: string[];
};

const AIsearch = () => {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<(ContentData & { similarity: number })[]>([]);

    // 검색 버튼 클릭 시 OpenAI LLM을 활용하여 해시태그 유사도 계산
    const handleSearch = async () => {
        console.log("DEBUG: handleSearch triggered with keyword:", keyword);
        if (!keyword.trim()) {
            console.log("DEBUG: Keyword is empty, aborting search.");
            return;
        }

        try {
            console.log("DEBUG: Fetching contents from API...");
            const res = await axios.get<ContentData[]>("https://api.trit.store/contents", {
                headers: { accept: "application/json" },
            });
            const contents = res.data;
            console.log(`DEBUG: Fetched ${contents.length} contents from API.`);

            // LLM에 전달할 프롬프트 구성
            const prompt = `
검색어: "${keyword.trim()}"
아래는 각 콘텐츠의 "contentId"와 "hashtags" 배열 목록입니다.
각 콘텐츠에 대해 검색어와 관련된 해시태그의 유사도를 0~1 사이의 숫자로 계산해 주세요.
유사도가 1이면 검색어와 해시태그가 완벽히 일치하며, 0이면 전혀 관련이 없음을 의미합니다.
반드시 오직 JSON 배열만 출력해 주세요.
출력 형식 예시:
[
  { "contentId": 1, "similarity": 0.85 },
  { "contentId": 2, "similarity": 0.42 },
  ...
]
콘텐츠 목록:
${JSON.stringify(
                contents.map((content) => ({
                    contentId: content.contentId,
                    hashtags: content.hashtags,
                })),
                null,
                2
            )}
      `;

            console.log("DEBUG: Constructed prompt:", prompt);

            const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
            if (!openAiApiKey) {
                console.error("ERROR: OPENAI_API_KEY가 정의되지 않았습니다.");
                return;
            }

            console.log("DEBUG: Calling OpenAI API...");
            const openAiResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content:
                                "당신은 콘텐츠 추천을 위한 해시태그 유사도 분석 도우미입니다. 오직 JSON 배열만 출력해 주세요.",
                        },
                        { role: "user", content: prompt },
                    ],
                    temperature: 0,
                    max_tokens: 800,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${openAiApiKey}`,
                    },
                }
            );

            console.log("DEBUG: OpenAI API response received.");
            console.log("DEBUG: OpenAI Response data:", openAiResponse.data);

            const resultText = openAiResponse.data.choices[0].message.content;
            console.log("DEBUG: Parsed resultText from OpenAI:", resultText);

            const similarityScores: { contentId: number; similarity: number }[] = JSON.parse(resultText);
            console.log("DEBUG: Parsed similarityScores:", similarityScores);

            // 각 콘텐츠에 대해 LLM이 제공한 유사도 점수를 추가
            const contentsWithSimilarity = contents.map((content) => {
                const scoreObj = similarityScores.find((item) => item.contentId === content.contentId);
                return { ...content, similarity: scoreObj ? scoreObj.similarity : 0 };
            });

            const sortedContents = contentsWithSimilarity.sort((a, b) => b.similarity - a.similarity);
            const topContents = sortedContents.slice(0, 5);
            setResults(topContents);

            console.log("DEBUG: Top matching contents:", topContents);
        } catch (error) {
            console.error("ERROR: Error during search:", error);
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>AI Search</h2>
            <input
                type="text"
                placeholder="검색할 키워드를 입력하세요."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ padding: "0.5rem", marginRight: "0.5rem" }}
            />
            <button onClick={handleSearch} style={{ padding: "0.5rem 1rem" }}>
                검색
            </button>

            {/* 결과가 있을 경우 간단히 화면에 렌더링 */}
            {results.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                    <h3>검색 결과 (유사도 순)</h3>
                    <ul>
                        {results.map((content) => (
                            <li key={content.contentId}>
                                {content.title} (유사도: {content.similarity.toFixed(2)})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AIsearch;
