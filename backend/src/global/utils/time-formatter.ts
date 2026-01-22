import { Logger } from '@nestjs/common';

export class TimeFormatter {
  private static readonly logger = new Logger(TimeFormatter.name);

  /**
   * Seoul Open API가 주는 날짜/시간 문자열을 Date로 파싱한다.
   * - Spring(TimeFormatter) 1:1 목적: 최대한 관대하게 파싱
   * - TODO: 케이스가 더 나오면 포맷별 파서를 확장
   */
  static parseDateTime(raw?: string | null): Date | null {
    if (!raw) return null;
    const s = raw.trim();
    if (!s) return null;

    // "2026.01.11" -> "2026-01-11"
    const normalized = s.replace(/\./g, '-').replace(/\s+/g, ' ');

    // yyyy-MM-dd HH:mm:ss.S (소수점 이하 1자리 이상)
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+$/.test(normalized)) {
      const dt = new Date(normalized.replace(' ', 'T') + '+09:00');
      return isNaN(dt.getTime()) ? null : dt;
    }

    // yyyy-MM-dd HH:mm:ss
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(normalized)) {
      const dt = new Date(normalized.replace(' ', 'T') + '+09:00');
      return isNaN(dt.getTime()) ? null : dt;
    }

    // YYYYMMDD
    if (/^\d{8}$/.test(normalized)) {
      const y = normalized.slice(0, 4);
      const m = normalized.slice(4, 6);
      const d = normalized.slice(6, 8);
      const dt = new Date(`${y}-${m}-${d}T00:00:00+09:00`);
      return isNaN(dt.getTime()) ? null : dt;
    }

    // YYYY-MM-DD HH:mm(:ss)?
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(normalized)) {
      const dt = new Date(normalized.replace(' ', 'T') + '+09:00');
      return isNaN(dt.getTime()) ? null : dt;
    }

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      const dt = new Date(`${normalized}T00:00:00+09:00`);
      return isNaN(dt.getTime()) ? null : dt;
    }

    const dt = new Date(normalized);
    if (!isNaN(dt.getTime())) return dt;

    // 파싱 실패: null 저장 + warn 로그(원본 길이 제한)
    const short = normalized.length > 120 ? normalized.slice(0, 120) + '...' : normalized;
    this.logger.warn(`parseDateTime failed: "${short}"`);
    return null;
  }
}

