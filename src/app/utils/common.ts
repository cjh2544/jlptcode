import { format, isValid, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ko } from 'date-fns/locale'

const TIME_ZONE = 'Asia/Seoul';

const parseContent = (content: any) => {
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

const formatToSeoulTime = (value: any, format: any = 'yyyy-MM-dd') => {
  let date;

  // 문자열일 경우
  if (typeof value === 'string') {
    // ISO 문자열 파싱 (2023-06-22 등)
    date = parseISO(value);
  } else if (value instanceof Date) {
    date = value;
  } else {
    return 'Invalid input';
  }

  // 유효성 검사
  if (!isValid(date)) {
    return 'Invalid date';
  }

  // 서울 시간으로 변환
  const zonedDate = toZonedTime(date, TIME_ZONE);

  // 원하는 형식으로 포맷
  return format(zonedDate, format, { locale: ko });
}

export {
  parseContent,
  formatToSeoulTime
}