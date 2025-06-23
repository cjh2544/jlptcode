import { format, toZonedTime } from 'date-fns-tz';

export const parseContent = (content: any) => {
  if(!content) return '';

  let qList = content.map((qItem: any) => {
    let result = '';

    if(typeof qItem === 'object') {
      if(qItem?.type === 'u') {
        result = '<u>' + (qItem?.content || '').toString().trim() + '</u>';
      } else if(qItem?.type === 'br') {
        result = '<br>';
      } else {
        result = (qItem?.content || '').toString().trim();
      }
    } else if(typeof qItem === 'string') {
      result = (qItem || '').toString().trim();
    }

    return result;
  });

  return (qList || []).join('').trim();
}

/**
 * 서울 시간대 상수
 */
const SEOUL_TIMEZONE = 'Asia/Seoul';

/**
 * 날짜를 서울 시간으로 포맷
 * @param {Date | string} date
 * @param {string} formatStr
 * @returns {string}
 */
export function formatInSeoul(date: Date | string | undefined | null, formatStr = 'yyyy-MM-dd HH:mm:ss'): string {
  if(!date) return '';
  
  const zonedDate = toZonedTime(date, SEOUL_TIMEZONE);
  return format(zonedDate, formatStr, { timeZone: SEOUL_TIMEZONE });
}

/**
 * 현재 시간(서울 기준) 반환
 * @returns {Date}
 */
export function getNowInSeoul(): Date {
  return toZonedTime(new Date(), SEOUL_TIMEZONE);
}

/**
 * 특정 시간대의 시간을 서울 시간으로 변환
 * @param {Date | string} date
 * @param {string} fromTimeZone
 * @returns {Date}
 */
export function convertToSeoul(date: Date | string, fromTimeZone: string): Date {
  // 입력 날짜를 fromTimeZone 기준으로 ZonedTime으로 변환
  const fromZonedTime = toZonedTime(date, fromTimeZone);
  
  // ZonedTime의 UTC timestamp를 기준으로 서울 시간대로 다시 ZonedTime 생성
  return toZonedTime(fromZonedTime, SEOUL_TIMEZONE);
}