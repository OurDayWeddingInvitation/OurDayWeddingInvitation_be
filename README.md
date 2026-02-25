<div align="center">

<!-- logo -->
<!-- <img src="https://your-image-url/logo.png" width="120"/> -->

# [💍 OurDayWedding](https://ourday.kr)

청첩장 제작 웹 서비스를 위한 백엔드 프로젝트

[<img src="https://img.shields.io/badge/Site-ourday.kr-blue?style=flat&logo=google-chrome&logoColor=white" />](https://www.ourday.kr)
[<img src="https://img.shields.io/badge/GitHub-OurDayWeddingInvitation__be-black?style=flat&logo=github&logoColor=white" />](https://github.com/OurDayWeddingInvitation/OurDayWeddingInvitation_be)
[<img src="https://img.shields.io/badge/Swagger-API-green?style=flat&logo=swagger&logoColor=white" />](https://www.ourday.kr/api/v1/api-docs/)

<br/>
<img src="https://img.shields.io/badge/프로젝트 기간-2025.11.01 ~ 2026.01.16-green?style=flat"/>

</div>

---

## 📝 프로젝트 개요

- 팀 사이드 프로젝트  
- 실사용 서비스 운영보다는 **기존 실무 환경과 다른 기술 스택과 개발 방식을 직접 경험해보기 위해 진행**

ERP 환경에서는 이미 정해진 기술과 구조 안에서 작업해왔지만  
이 프로젝트에서는 **기술 선택부터 구조, 구현 방식까지  
모두 스스로 결정해야 하는 상황**을 의도적으로 만들었습니다.

기능적으로는 청첩장 생성, 공유, 응답 수집 등  
비교적 단순한 기능을 다루지만  
**백엔드 서비스의 흐름을 처음부터 끝까지 직접 구성해보는 것**을 목표로 했습니다.

---

## ⚙️ 맡은 역할

- 백엔드 API 구현
- 데이터베이스 모델링
- 프론트엔드와 연동되는 API 스펙 정의
- 서버 구성 및 배포 환경 설정

백엔드 구현을 중심으로 작업했지만 화면 설계서를 기준으로  
**프론트엔드에서 필요로 할 파라미터와 응답 구조를 먼저 고려해 API를 설계**했습니다.

---

## 🗂️ APIs

청첩장 서비스에서 사용하는 주요 API는 아래 문서에서 확인할 수 있습니다.

- 청첩장 생성 / 조회 / 수정
- 섹션별 데이터 관리 API
- 이미지 및 미디어 조회 API
- 공유 링크 접근 API

👉 [Swagger UI 바로가기](https://www.ourday.kr/api/v1/api-docs/)

---

## ⚙ 기술 스택

### Back-end
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### Database
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)

### Infra / Environment
![AWS EC2](https://img.shields.io/badge/AWS%20EC2-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

### Tools
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)


---

## 🤔 기술적 이슈와 해결 과정

### 1. 백엔드 구조를 직접 설계하며 겪은 시행착오

실무에서는 이미 정해진 구조 안에서 작업해왔지만  
이 프로젝트에서는 라우트 → 서비스 → DB로 이어지는  
기본적인 백엔드 흐름을 처음부터 직접 구성해야 했습니다.

각 레이어의 책임을 어디까지 나눠야 하는지 명확하지 않아  
초기에는 구조를 여러 번 변경하며 작업을 진행했습니다.

이 과정에서 **구조를 판단할 기준 자체가 경험에서 나온다는 점**을 체감했습니다.

### 2. DB 모델 중심 API 설계의 한계

초기에는 DB 모델을 기준으로 API를 설계했지만  
프론트엔드 개발이 진행되면서  
요청·응답 구조가 DB에 강하게 결합되어 있다는 문제를 인식했습니다.

이후에는 요청 단위 DTO를 분리하고  
API 변경 시 프론트엔드에 미치는 영향을 줄이는 방향으로  
구조를 점진적으로 수정했습니다.

---

## 💁‍♂️ 프로젝트 팀원

| 역할 | 이름 |
|------|------|
| Backend | 김윤환 |
