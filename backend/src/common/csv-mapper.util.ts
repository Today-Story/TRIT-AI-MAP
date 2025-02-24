import {Category} from "./enum/category.enum";


export function mapCategory(csvCategory: string): Category {
    if (!csvCategory) return null;

    switch (csvCategory.trim()) {

        case '여행':
            return Category.TRAVEL;
        case '푸드':
            return Category.FOOD;
        case '뷰티':
            return Category.BEAUTY;
        case '쇼핑':
            return Category.SHOPPING;
        default:
            return Category.ALL; // 기본값 또는 오류 처리
    }
}

export function mapGender(csvGender: string): string {
    if (!csvGender) return null;

    switch (csvGender.trim()) {
        case '남':
            return 'MAN';
        case '여':
            return 'WOMAN';
        default:
            return ''; // 빈 문자열 또는 예외 처리
    }
}
