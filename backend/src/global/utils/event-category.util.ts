export class EventCategoryUtil {
  /**
   * CODENAME(서브 카테고리) -> major category 매핑
   * Spring(EventCategoryUtil) 1:1 목적.
   *
   * TODO: 실제 Spring 매핑 테이블이 있으면 그대로 이관(현재는 최소 구현)
   */
  static getCategory(codeName?: string | null): string | null {
    if (!codeName) return null;
    const s = codeName.trim();
    if (!s) return null;

    // 흔한 구분자 기반 최소 매핑
    for (const sep of ['/', '>', '-', '|']) {
      if (s.includes(sep)) {
        return s.split(sep)[0].trim() || s;
      }
    }

    // 공백 기준 첫 토큰을 major로 보는 최소 규칙
    const [first] = s.split(/\s+/);
    return first || s;
  }
}

