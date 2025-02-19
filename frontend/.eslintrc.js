module.exports = {
    env: {
      browser: true, // 브라우저 환경에서 실행
      es2021: true, // 최신 ECMAScript 지원
    },
    extends: [
      "eslint:recommended", // ESLint 추천 규칙 사용
      "plugin:react/recommended", // React 추천 규칙 사용
      "plugin:@typescript-eslint/recommended", // TypeScript 추천 규칙 사용
      "prettier" // Prettier와 충돌 방지
    ],
    parser: "@typescript-eslint/parser", // TypeScript 파서 사용
    parserOptions: {
      ecmaVersion: "latest", // 최신 ECMAScript 문법 지원
      sourceType: "module", // 모듈 시스템 사용
    },
    plugins: [
      "react", // React 플러그인 추가
      "@typescript-eslint", // TypeScript 관련 ESLint 플러그인 추가
      "prettier" // Prettier 플러그인 추가
    ],
    rules: {
      "prettier/prettier": "error", // Prettier 규칙을 ESLint 오류로 표시
      "react/react-in-jsx-scope": "off", // React 자동 import 필요 없음 (Next.js 등의 환경에서 유용)
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // 사용되지 않는 변수 경고 (예: _로 시작하는 변수는 예외)
      "react/jsx-uses-react": "off", // React 17 이후 JSX 자동 import
      "react/jsx-uses-vars": "warn", // 사용되지 않는 JSX 변수를 경고
      "@typescript-eslint/no-explicit-any": "off", // any 타입 허용
    },
    settings: {
      react: {
        version: "detect", // React 버전 자동 감지
      },
    },
  };
  