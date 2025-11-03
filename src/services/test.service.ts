/**
 * @file 서비스 계층 (Spring의 @Service 유사)
 * 실제 데이터 처리, DB 호출 등을 담당
 */
export const getTestData = () => {
  // 실제 DB 연결 전이므로, 임시(mock) 데이터 반환
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
};
