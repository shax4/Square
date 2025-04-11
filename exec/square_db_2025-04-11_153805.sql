-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: j12a307.p.ssafy.io    Database: square_db
-- ------------------------------------------------------
-- Server version	8.4.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK46ccwnsi9409t36lurvtyljak` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (3,'경제'),(5,'기술'),(1,'사회'),(6,'윤리'),(2,'정치'),(4,'환경');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

--
-- Table structure for table `daily_debate`
--

DROP TABLE IF EXISTS `daily_debate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_debate` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `debate_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4dbonxdw725abixxdnje77kho` (`date`),
  KEY `FKirvrbissclirb6kxmq1thhrv4` (`debate_id`),
  CONSTRAINT `FKirvrbissclirb6kxmq1thhrv4` FOREIGN KEY (`debate_id`) REFERENCES `debate` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_debate`
--

/*!40000 ALTER TABLE `daily_debate` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_debate` ENABLE KEYS */;

--
-- Table structure for table `debate`
--

DROP TABLE IF EXISTS `debate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `debate` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `left_option` varchar(255) NOT NULL,
  `right_option` varchar(255) NOT NULL,
  `topic` varchar(255) NOT NULL,
  `is_valid` bit(1) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5u0c9ql2c4hs1fvfig9ljqosw` (`category_id`),
  CONSTRAINT `FK5u0c9ql2c4hs1fvfig9ljqosw` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debate`
--

/*!40000 ALTER TABLE `debate` DISABLE KEYS */;
INSERT INTO `debate` VALUES (61,'제한','자율','청소년에게 야간 외출 제한을 두어야 하는가?',0x01,6),(62,'유지','폐지','사형제를 유지해야 하는가?',0x01,6),(63,'무상','유료','대학 등록금을 무상으로 해야 하는가?',0x01,3),(64,'연장','유지','정년 연장을 시행해야 하는가?',0x01,1),(65,'찬성','반대','주 4일제를 도입해야 하는가?',0x01,3),(67,'찬성','반대','인터넷 실명제 도입해야 할까?',0x01,1),(70,'의무','자율','반려동물 등록을 의무화해야 하는가?',0x01,1),(122,'찬성','반대','대중교통 기본요금 무료화, 가능할까?',0x01,1);
/*!40000 ALTER TABLE `debate` ENABLE KEYS */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `is_like` bit(1) NOT NULL,
  `target_id` bigint NOT NULL,
  `target_type` enum('DEBATE','OPINION','OPINION_COMMENT','POST','POST_COMMENT','PROPOSAL') NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`,`target_type`,`target_id`),
  CONSTRAINT `FKi2wo4dyk4rok7v4kak8sgkwx0` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=658 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (639,'2025-04-10 05:14:45.784717','2025-04-10 05:14:45.784717',0x01,59,'POST',3),(640,'2025-04-10 05:14:45.813594','2025-04-10 05:14:45.813594',0x01,46,'POST',3),(641,'2025-04-10 05:44:45.785373','2025-04-10 06:14:45.807085',0x00,45,'POST',3),(642,'2025-04-10 05:59:45.785725','2025-04-10 06:19:45.787332',0x00,44,'POST',3),(643,'2025-04-10 06:04:45.823506','2025-04-10 06:29:45.802885',0x01,43,'POST',3),(644,'2025-04-10 06:29:45.782684','2025-04-10 06:29:45.782684',0x01,42,'POST',3),(645,'2025-04-10 11:20:21.644866','2025-04-10 11:20:21.644866',0x01,37,'PROPOSAL',3),(646,'2025-04-10 22:16:23.000000','2025-04-10 22:16:25.000000',0x01,46,'POST',2),(647,'2025-04-10 22:17:07.000000','2025-04-10 22:17:05.000000',0x01,47,'POST',2),(648,'2025-04-10 22:17:21.000000','2025-04-10 22:17:22.000000',0x01,48,'POST',2),(649,'2025-04-10 16:46:08.826029','2025-04-10 16:46:08.826029',0x01,3,'PROPOSAL',35),(650,'2025-04-10 18:46:08.827620','2025-04-10 18:46:08.827620',0x01,140,'OPINION',35),(651,'2025-04-11 00:11:08.820261','2025-04-11 00:16:08.866523',0x00,124,'OPINION',35),(652,'2025-04-11 00:11:08.840077','2025-04-11 00:11:08.840077',0x01,125,'OPINION',35),(653,'2025-04-11 00:11:08.859567','2025-04-11 00:11:08.859567',0x01,158,'OPINION',35),(654,'2025-04-11 00:11:08.881585','2025-04-11 00:11:08.881585',0x01,107,'OPINION_COMMENT',35),(655,'2025-04-11 00:16:08.822711','2025-04-11 00:16:08.822711',0x01,140,'OPINION',34),(656,'2025-04-11 00:16:08.845875','2025-04-11 00:16:08.845875',0x01,122,'OPINION',35),(657,'2025-04-11 04:43:47.734716','2025-04-11 04:43:47.734716',0x01,141,'OPINION',26);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `target_id` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('DEBATE_COMMENT','NOTICE','POST_COMMENT','TODAY_DEBATE') NOT NULL,
  `receiver_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmlidwdldgmdw67l7pbrval0un` (`receiver_id`),
  CONSTRAINT `FKmlidwdldgmdw67l7pbrval0un` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=433 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;

--
-- Table structure for table `opinion`
--

DROP TABLE IF EXISTS `opinion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opinion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `comment_count` int NOT NULL,
  `content` varchar(255) NOT NULL,
  `is_left` bit(1) NOT NULL,
  `like_count` int NOT NULL,
  `is_valid` bit(1) NOT NULL,
  `debate_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhwfnrn21uwxp6en5pohsfp4aj` (`debate_id`),
  KEY `FKnifwjuxuse33c615nw3cb6r7x` (`user_id`),
  CONSTRAINT `FKhwfnrn21uwxp6en5pohsfp4aj` FOREIGN KEY (`debate_id`) REFERENCES `debate` (`id`),
  CONSTRAINT `FKnifwjuxuse33c615nw3cb6r7x` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opinion`
--

/*!40000 ALTER TABLE `opinion` DISABLE KEYS */;
INSERT INTO `opinion` VALUES (122,'2025-03-04 17:18:00.000000','2025-04-11 00:16:08.850529',0,'요즘 유기동물 문제 너무 심각합니다. 최소한 등록은 의무로 가야죠.',0x01,1,0x01,70,39),(123,'2025-03-10 17:18:34.000000','2025-03-10 17:18:42.000000',0,'책임감 없이 키우는 사람들 너무 많아요. 등록제가 당연한 수순이라 봅니다.',0x01,0,0x01,70,3),(124,'2025-04-01 17:18:49.000000','2025-04-11 00:16:08.866617',1,'등록해야 관리도 되고 정책도 세울 수 있죠. 반대하는 이유를 모르겠네요.',0x01,0,0x01,70,6),(125,'2025-04-06 17:19:12.000000','2025-04-11 00:11:08.844237',1,'정부가 또 감시하려는 거 아닌가요? 솔직히 부담만 늘어나는 느낌입니다.',0x00,1,0x01,70,39),(131,'2025-04-10 17:19:20.000000',NULL,0,'취지는 알겠지만, 모든 사람에게 의무화는 좀 과하다고 생각합니다.',0x00,0,0x01,70,5),(132,'2025-03-04 17:18:00.000000',NULL,0,'요즘 악플 너무 심해요. 실명제라도 도입해서 좀 줄여야 하지 않나요?',0x01,0,0x01,67,1),(133,'2025-03-10 17:18:34.000000',NULL,0,'익명 뒤에 숨어서 막말하는 사람들 보면 실명제가 필요하다고 느껴요.',0x01,0,0x01,67,39),(134,'2025-04-01 17:18:49.000000',NULL,0,'실명제 한다고 악플이 사라질까요? 표현의 자유만 침해될 듯.',0x00,0,0x01,67,2),(135,'2025-04-06 17:19:12.000000',NULL,0,'정부 감시만 심해질 거 같아요. 더 무서운 세상 되는 거 아닌가요?',0x00,0,0x01,67,5),(136,'2025-04-10 17:19:20.000000',NULL,0,'익명성이 있어야 진짜 말도 나올 수 있는 거 아닌가요?',0x00,0,0x01,67,3),(137,'2025-03-04 17:18:00.000000',NULL,0,'일만 하다 인생 끝날 것 같아요. 주 4일제 꼭 좀 도입해 주세요.',0x01,0,0x01,65,39),(138,'2025-03-10 17:18:34.000000',NULL,0,'시간 줄어도 효율만 올라가면 되죠. 결국 일은 사람이 하는 거니까요.',0x01,0,0x01,65,3),(139,'2025-04-01 17:18:49.000000',NULL,0,'금요일마다 눈치 안 보고 쉴 수 있다면 삶의 질이 엄청 올라갈 듯.',0x01,0,0x01,65,4),(140,'2025-04-06 17:19:12.000000','2025-04-11 00:16:08.826709',0,'실제로 몇몇 기업은 이미 하고 있고 효과도 좋다는 사례 많잖아요.',0x01,2,0x01,65,6),(141,'2025-04-10 17:19:20.000000','2025-04-11 04:43:47.740903',0,'듣기엔 좋아 보이지만 현실은 야근 늘어나고 주말에도 일할 듯요.',0x00,1,0x01,65,2),(158,'2025-04-10 13:16:13.555791','2025-04-11 00:11:08.864500',0,'반려동물 등록은 무조건 자율화해야지요!',0x00,1,0x01,70,34),(159,'2025-04-11 02:09:45.458332','2025-04-11 02:09:45.458332',0,'정부가 또 감시하려는 거 아닌가요? 솔직히 부담만 늘어나는 느낌입니다.',0x00,0,0x01,70,2),(160,'2025-04-11 02:09:55.535710','2025-04-11 02:09:55.535710',0,'정부가 또 감시하려는 거 아닌가요? 솔직히 부담만 늘어나는 느낌입니다.',0x00,0,0x01,70,2),(161,'2025-04-11 02:10:15.166587','2025-04-11 02:10:15.166587',0,'정부가 또 감시하려는 거 아닌가요? 솔직히 부담만 늘어나는 느낌입니다.',0x00,0,0x01,70,2),(162,'2025-04-11 02:10:19.141200','2025-04-11 02:10:19.141200',0,'정부가 또 감시하려는 거 아닌가요? 솔직히 부담만 늘어나는 느낌입니다.',0x00,0,0x01,70,2),(163,'2025-04-11 02:10:53.215139','2025-04-11 02:10:53.215139',0,'정부가 또 감시하려는 거 아닌가요? 솔직히 부담만 늘어나는 느낌입니다.',0x00,0,0x01,70,2);
/*!40000 ALTER TABLE `opinion` ENABLE KEYS */;

--
-- Table structure for table `opinion_comment`
--

DROP TABLE IF EXISTS `opinion_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opinion_comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `content` varchar(255) NOT NULL,
  `like_count` int NOT NULL,
  `is_valid` bit(1) NOT NULL,
  `opinion_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5qhsp8h3knc3rcs4pw0i5vn6p` (`opinion_id`),
  KEY `FKhb8akjasmfi7g4sl3uq72ti6a` (`user_id`),
  CONSTRAINT `FK5qhsp8h3knc3rcs4pw0i5vn6p` FOREIGN KEY (`opinion_id`) REFERENCES `opinion` (`id`),
  CONSTRAINT `FKhb8akjasmfi7g4sl3uq72ti6a` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opinion_comment`
--

/*!40000 ALTER TABLE `opinion_comment` DISABLE KEYS */;
INSERT INTO `opinion_comment` VALUES (107,'2025-04-11 00:09:49.703759','2025-04-11 00:11:08.886253','맞아요, 유기견 문제 해결에도 큰 도움이 될 거에요!',1,0x01,124,39),(108,'2025-04-11 00:10:49.245136','2025-04-11 00:10:49.245136','적절한 조치를 위한 과정이라 생각합니다.',0,0x01,125,39),(109,'2025-04-11 00:10:58.449529','2025-04-11 00:11:06.930943','적절한 조치를 위한 과정이라 생각합니다.',0,0x00,125,39);
/*!40000 ALTER TABLE `opinion_comment` ENABLE KEYS */;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `content` varchar(255) NOT NULL,
  `like_count` int NOT NULL,
  `reference_count` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('COMMON','ICSB','ICSR','ICTB','ICTR','INSB','INSR','INTB','INTR','PCSB','PCSR','PCTB','PCTR','PNSB','PNSR','PNTB','PNTR') NOT NULL,
  `is_valid` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK72mt33dhhs48hf9gcqrq4fxte` (`user_id`),
  CONSTRAINT `FK72mt33dhhs48hf9gcqrq4fxte` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,'2025-04-03 15:37:11.000000','2025-04-07 08:38:55.354888','요즘 절대평가 얘기가 많던데, 저도 수험생일 땐 진짜 상대평가가 너무 스트레스였어요. 바뀌면 좋겠네요.',5,1,'절대평가, 정말 필요할까?','ICSB',0x01,1),(2,'2025-04-03 15:37:11.000000','2025-04-03 15:37:11.000000','4일 근무제 뉴스 보고 진심 부러웠어요. 일도 삶도 다 챙길 수 있는 그런 환경, 왜 우린 아직도 못할까요?',8,2,'주 4일 근무제, 빨리 됐으면 좋겠어요ㅠㅠ','PNTB',0x01,2),(3,'2025-04-03 15:37:11.000000','2025-04-03 15:37:11.000000','기본소득이 생기면 전 하고 싶은 공부나 일을 시도해볼 것 같아요. 단지 생존이 아니라 삶을 누리는 느낌?',5,1,'기본소득이 생긴다면 하고 싶은 일','INSR',0x01,3),(4,'2025-04-03 15:37:11.000000','2025-04-09 09:24:25.890158','아이들이 스마트폰 너무 오래 하는 것 같아서 걱정이에요. 교육적으로 활용하는 건 좋지만, 시간 제한은 필요하지 않을까요?',2,0,'청소년 스마트폰, 어디까지 허용할까?','ICTR',0x01,4),(5,'2025-04-03 15:37:11.000000','2025-04-04 07:51:07.673129','반려동물 등록제, 저는 찬성이에요. 책임감 있게 키우는 문화가 자리 잡아야 한다고 생각해요.',8,2,'반려동물 등록제, 여러분 생각은?','PNTR',0x01,5),(26,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','제가 매일 하는 운동 루틴입니다.',12,3,'운동 루틴 공유','INSB',0x01,39),(27,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','서울숲 정말 좋아요!',8,5,'산책하기 좋은 장소','INSB',0x01,2),(28,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','아침은 오트밀, 점심은 닭가슴살 추천!',20,2,'건강을 위한 식단 추천','ICTR',0x01,3),(29,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','하루 만보 걷기가 건강에 얼마나 좋은지 아시나요?',15,1,'걷기의 중요성','INSR',0x01,4),(30,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','이 영상 보고 허리 통증이 줄었어요.',5,4,'스트레칭 영상 추천','PNTB',0x01,6),(31,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','한강 러닝 추천해요!',7,0,'내가 좋아하는 러닝 코스','INSB',0x01,39),(32,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','비 오는 날에도 걷는 거 좋아하시나요?',3,1,'비 오는 날 걷기','INSB',0x01,2),(33,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','드디어 30일 연속 달성!',25,6,'애플워치 목표 달성!','ICTR',0x01,39),(34,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','건강을 위해 더 중요한 건 무엇일까요?',9,2,'식단 vs 운동','INSR',0x01,4),(35,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','이 앱으로 목표 달성률 확인 가능해요.',11,3,'건강앱 추천해요','PNTB',0x01,6),(36,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','여러분은 어떤 걸 더 선호하시나요?',6,0,'헬스장 vs 야외운동','INSB',0x01,1),(37,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','사람도 적고 공기도 좋고 최고예요.',4,2,'밤 산책의 매력','INSB',0x01,2),(38,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','스트레칭 꼭 하세요!',2,0,'무릎 통증 조심하세요','ICTR',0x01,3),(39,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','걷기만큼 수분 보충도 중요해요.',13,1,'물 많이 마시기','INSR',0x01,4),(40,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','편한 신발이 정말 중요해요.',3,1,'발바닥 통증 해결법','PNTB',0x01,6),(41,'2025-04-04 17:55:37.000000','2025-04-04 17:55:37.000000','함께 걷거나 러닝 하실 분?',10,2,'주말 운동 모임 구해요','INSB',0x01,1),(42,'2025-04-04 17:55:37.000000','2025-04-10 06:29:45.786414','3일 연속 성공했어요.',17,4,'하루 1만보 성공!','INSB',0x01,2),(43,'2025-04-04 17:55:37.000000','2025-04-10 06:29:45.802976','비트 빠른 음악 추천해요!',6,0,'걷기 중 음악 추천','ICTR',0x01,3),(44,'2025-04-04 17:55:37.000000','2025-04-10 06:19:45.787447','기록 남기기 정말 좋아요.',7,3,'걷기 기록 어플 추천','INSR',0x01,4),(45,'2025-04-04 17:55:37.000000','2025-04-10 06:14:45.807184','작은 습관이 큰 변화를 만듭니다.',18,5,'건강한 삶을 위하여','PNTB',0x01,6),(60,'2025-04-10 06:10:42.249537','2025-04-10 06:10:42.249537','요즘 절대평가 얘기가 많던데, 저도 수험생일 땐 진짜 상대평가가 너무 스트레스였어요. 바뀌면 좋겠네요.',0,0,'절대평가 정말 필요할까요?','COMMON',0x01,6);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;

--
-- Table structure for table `post_comment`
--

DROP TABLE IF EXISTS `post_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `like_count` int NOT NULL,
  `is_valid` bit(1) NOT NULL,
  `parent_id` bigint DEFAULT NULL,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmqxhu8q0j94rcly3yxlv0u498` (`parent_id`),
  KEY `FKna4y825fdc5hw8aow65ijexm0` (`post_id`),
  KEY `FKtc1fl97yq74q7j8i08ds731s1` (`user_id`),
  CONSTRAINT `FKmqxhu8q0j94rcly3yxlv0u498` FOREIGN KEY (`parent_id`) REFERENCES `post_comment` (`id`),
  CONSTRAINT `FKna4y825fdc5hw8aow65ijexm0` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  CONSTRAINT `FKtc1fl97yq74q7j8i08ds731s1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_comment`
--

/*!40000 ALTER TABLE `post_comment` DISABLE KEYS */;
INSERT INTO `post_comment` VALUES (1,'저도 고등학교 때 상대평가 때문에 친구랑 경쟁하게 돼서 너무 힘들었어요.',5,0x01,NULL,1,2,NULL,'2025-04-07 08:38:55.405315'),(2,'근데 절대평가로 바뀌면 내신 변별이 더 어려워지지 않을까요?',2,0x01,NULL,1,3,NULL,NULL),(3,'저도 주 4일제 완전 찬성입니다! 일에 더 집중할 수 있을 것 같아요.',5,0x01,NULL,2,1,NULL,NULL),(4,'근데 현실적으로 중소기업은 인력 부족 때문에 힘들지도 몰라요.',3,0x01,NULL,2,4,NULL,NULL),(5,'공감돼요! 저도 글쓰기나 디자인 같은 창작 일 해보고 싶어요.',6,0x01,NULL,3,5,NULL,NULL),(6,'기본소득이 도입되면 진짜 삶의 방식이 많이 바뀔 것 같네요.',2,0x01,NULL,3,2,NULL,NULL),(7,'스마트폰은 통제보다 교육이 중요한 것 같아요. 자율을 길러줘야죠.',3,0x01,NULL,4,5,NULL,NULL),(8,'시간 제한도 좋지만, 부모랑 같이 사용하는 습관부터 바꿔야 한다고 봐요.',1,0x01,NULL,4,1,NULL,NULL),(9,'완전 공감이요. 강아지 잃어버렸을 때 등록제 덕분에 찾았어요!',7,0x01,NULL,5,3,NULL,NULL),(10,'근데 등록비나 유지비가 부담된다는 분들도 계시더라고요.',2,0x01,NULL,5,4,NULL,NULL),(20,'좋은 정보 감사합니다!',3,0x01,NULL,1,1,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(21,'공감되네요!',5,0x01,NULL,1,2,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(22,'여기 꼭 가보고 싶어요.',2,0x01,NULL,2,3,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(23,'사진도 같이 올려주세요!',1,0x01,NULL,2,4,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(24,'식단 참고할게요.',4,0x01,NULL,3,5,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(25,'오트밀 진짜 맛있죠 ㅋㅋ',2,0x01,NULL,39,1,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(26,'매일 하긴 힘들어요 ㅠㅠ',1,0x01,NULL,4,2,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(27,'저도 도전해볼게요!',3,0x01,NULL,4,3,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(28,'러닝 코스 공유 감사합니다.',0,0x01,NULL,39,4,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(29,'저랑 같은 코스네요!',2,0x01,NULL,5,5,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(30,'네 덕분에 도움 많이 됐어요.',1,0x01,1,1,1,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(31,'저도 공감이에요!',0,0x01,2,1,2,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(32,'가보시면 좋아요~',2,0x01,3,2,3,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(33,'사진 곧 올릴게요!',1,0x01,4,2,4,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(34,'도움 되셨다니 다행이네요.',3,0x01,5,3,39,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(35,'ㅋㅋ 진짜 맛있어요',2,0x01,6,39,1,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(36,'습관이 되면 괜찮아요!',1,0x01,7,4,2,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(37,'응원합니다!',0,0x01,8,4,39,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(38,'자주 같이 뛰어요!',2,0x01,9,5,39,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(39,'오 반가워요~',1,0x01,10,5,5,'2025-04-04 17:58:54.000000','2025-04-04 17:58:54.000000'),(101,'와 축하드려요!!',0,0x01,NULL,33,5,'2025-04-11 01:06:13.952524','2025-04-11 01:06:13.952524');
/*!40000 ALTER TABLE `post_comment` ENABLE KEYS */;

--
-- Table structure for table `post_image`
--

DROP TABLE IF EXISTS `post_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `s3key` varchar(255) NOT NULL,
  `post_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK28ll1iky03p173gcx87my158r` (`s3key`),
  KEY `FKsip7qv57jw2fw50g97t16nrjr` (`post_id`),
  CONSTRAINT `FKsip7qv57jw2fw50g97t16nrjr` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_image`
--

/*!40000 ALTER TABLE `post_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_image` ENABLE KEYS */;

--
-- Table structure for table `proposal`
--

DROP TABLE IF EXISTS `proposal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposal` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `like_count` int NOT NULL,
  `topic` varchar(255) NOT NULL,
  `is_valid` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsai0trq10qhso24f5aytg9aqw` (`user_id`),
  CONSTRAINT `FKsai0trq10qhso24f5aytg9aqw` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposal`
--

/*!40000 ALTER TABLE `proposal` DISABLE KEYS */;
INSERT INTO `proposal` VALUES (1,44,'철도 민영화 해야할까요?',0x01,1),(2,11,'건강보험료 인상해야할까요?',0x01,2),(3,23,'공유 킥보드 도심에 있어도 괜찮은가?',0x00,3),(4,0,'대외무역 관세 인하해야한다.',0x01,3),(29,0,'대중교통 기본요금 무료화, 가능할까?',0x00,5),(39,0,'어린이 조기 코딩교육, 필수일까?',0x01,35);
/*!40000 ALTER TABLE `proposal` ENABLE KEYS */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `direction` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'P','중요한 결정을 내릴 때, 현실적인 제약과 조건을 먼저 고려하는 편이다.',0x01),(2,'I','중요한 결정을 내릴 때, 이상적인 가치와 비전을 우선 고려하는 편이다.',0x00),(3,'P','목표를 설정할 때, 실행 가능성과 구체적인 계획 수립이 이상적인 비전보다 우선이라고 생각한다.',0x01),(4,'I','목표를 설정할 때, 높은 이상과 꿈을 추구하는 것이 실현 가능성보다 더 중요하다고 생각한다.',0x00),(5,'P','사회 변화는 점진적인 조정과 현실적 접근을 통해 이루어져야 한다고 믿는다.',0x01),(6,'I','사회 변화는 급진적인 혁신과 대담한 개혁을 통해 이루어져야 한다고 믿는다.',0x00),(7,'P','문제 해결 시, 감정보다 객관적인 사실과 데이터에 의존하는 편이다.',0x01),(8,'I','성공은 구체적인 계획보다는 영감과 이상을 바탕으로 달성된다고 생각한다.',0x00),(9,'N','개인의 자유와 선택이 공동체의 조화보다 더 중요하다고 생각한다.',0x01),(10,'C','공동체의 조화와 협력이 개인의 자유보다 더 중요한 가치라고 생각한다.',0x00),(11,'N','자신의 목표와 행복이 집단의 규범보다 우선되어야 한다고 믿는다.',0x01),(12,'C','집단의 목표와 가치가 개인의 이익보다 우선되어야 한다고 믿는다.',0x00),(13,'N','경쟁과 독립적인 판단이 사회 발전에 필수적이라고 생각한다.',0x01),(14,'C','타인과의 협력을 통해 사회 문제를 해결하는 것이 바람직하다고 생각한다.',0x00),(15,'N','개인의 독립적 의사결정이 자신의 성공에 결정적이라고 여긴다.',0x01),(16,'C','공동체의 안전과 복지가 개인의 선택보다 우선시되어야 한다고 생각한다.',0x00),(17,'T','새로운 기술이 사회 발전에 긍정적인 영향을 미친다고 생각한다.',0x01),(18,'S','환경 보호와 지속 가능한 발전이 기술 혁신보다 더 중요하다고 생각한다.',0x00),(19,'T','AI 및 자동화 기술의 발전이 미래 사회에 필수적이라고 믿는다.',0x01),(20,'S','자연과 생태계 보존이 미래 사회 번영의 전제 조건이라고 믿는다.',0x00),(21,'T','우주 개발과 첨단 기술 연구가 경제 성장의 핵심이라고 생각한다.',0x01),(22,'S','환경 친화적인 정책이 장기적인 경제 발전의 기초라고 생각한다.',0x00),(23,'T','기술 혁신이 생활의 편리함과 효율성을 크게 향상시킨다고 믿는다.',0x01),(24,'S','기술 발전이 환경 파괴를 초래할 수 있으므로, 환경 보호를 우선시해야 한다고 믿는다.',0x00),(25,'B','직업 선택 시, 안정적인 환경과 예측 가능한 미래를 가장 중요한 요소로 고려한다.',0x01),(26,'R','실패의 가능성이 있더라도 새로운 도전을 통해 성장해야 한다고 생각한다.',0x00),(27,'B','리스크를 최소화하여 안전한 생활을 유지하는 것이 필요하다고 생각한다.',0x01),(28,'R','불확실한 기회라도 도전을 받아들이는 것이 개인 발전에 큰 도움이 된다고 믿는다.',0x00),(29,'B','예측 가능한 생활 패턴이 불확실한 도전보다 더 가치 있다고 느낀다.',0x01),(30,'R','모험적인 선택이 때로는 혁신과 창의성을 촉진한다고 생각한다.',0x00),(31,'B','일상에서의 규칙성과 안정성이 장기적인 성공의 기반이라고 믿는다.',0x01),(32,'R','안정적인 선택보다 때로는 모험적인 결정을 내리는 것이 필요하다고 느낀다.',0x00);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `expiry` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1055 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES ('2025-05-08 07:50:44.928000',616,7,'OcvlSBoHgiRDmiuJ6xvt4TsLdQOa7clxb9b8KZeIQ_o'),('2025-05-08 08:48:29.436000',639,8,'cN45pzRdpwLe_nFI2wYx0EEVwYNVEnU9RY9LEw_nz48'),('2025-05-08 09:55:08.499000',649,10,'Us-TFL5AfuW5qFEEaeX87kXTp7ZRdGromqdeuD3zlyA'),('2025-05-09 04:19:35.717000',723,11,'MLNYppiuTA8rJLL8YRUZqlRVfphdVeUNd_hgpmcWI60'),('2025-05-09 05:45:26.979000',741,12,'M9Pe6TFlSAgyRy3KHx4JHr41QAtEvb7Dbau4u6SgF1g'),('2025-05-09 06:57:02.438000',755,13,'4S3g-ZVHro9qZ4XdDH1qJG65p9k_B07Xvx_H0VQSk14'),('2025-05-09 07:26:04.516000',765,14,'bN5wfXnffnndeXKVFSiIesaPqaGOymFlzsFb34OSqII'),('2025-05-09 07:37:54.908000',771,15,'cZdcdU5pneqd9eU0bCL6y-rMnn3Sn4N2GzE4K4PuQKo'),('2025-05-09 07:57:21.839000',781,16,'oVWC1YR1uGWbHhqPCWC9xh2oe5-NFjGLI6N6Z3Cbvq4'),('2025-05-09 08:10:29.606000',783,17,'Ovs_ZICCzSfu0dwGADQS6OAf_pO5WU-Fx96J3VuO8Tk'),('2025-05-09 08:29:32.260000',789,18,'56k1WRoJMULbuaW023BpSVFX5O8nbYlRkILkfy7TlJ0'),('2025-05-09 08:40:14.741000',796,19,'bu94tbpvXCheMo3X8QV6Nb6spA217-jjgenq3rNzMq4'),('2025-05-09 08:44:44.679000',797,20,'It2PstbxHqeV3HKrbxoBlftn4QO5ishHNXhxIA6zbl0'),('2025-05-09 08:53:13.045000',803,21,'upIKWFkanJdVwHAtvunqw6Qk4yCkuHtXNbhh7gFHu7w'),('2025-05-09 08:55:13.662000',807,22,'7Ji0k6jAbueETdHKbPtoWbjXkOHAEmpHYzrjW0pZaFY'),('2025-05-09 08:56:12.365000',808,23,'AzVUWQErTNKh4_ejTC_UljEkccBdMDhmQ-6pR57jFYs'),('2025-05-09 09:25:41.011000',815,24,'orJUBGOkUmg8sob9nrzBu9_Ya5mbfDNNjcGOONKXPEE'),('2025-05-09 12:23:38.711000',835,25,'wkmIvbAWZNspQ2Nay6JHe-fKcXqOLS3JTk9qwuxlJVA'),('2025-05-10 01:52:13.928000',869,27,'pzyjXc0MLNKlW0NKmP3J0ZMEVBRcKcgFgkIfehhiIzo'),('2025-05-10 04:14:23.205000',886,28,'O0S0I0A7Vs0TqQb9SxyoJ5iTSEsxH-prYs6h1WxD27o'),('2025-05-10 04:59:54.257000',894,29,'P0z3eoBmxzB2LVpmAov9lhstdddhSXOHraWhYfrHfLU'),('2025-05-10 05:48:17.143000',901,30,'RU6YgkQkqycKgi-EEtM6sFivpe7qeW1GVMLmqOGqW2k'),('2025-05-10 06:11:54.030000',904,4,'r_LYTR2kfa4hUsniCRKHo0NF35A8PyY09CGE8ENQ9XM'),('2025-05-10 06:21:01.447000',905,31,'t6MS-8D-mXZxK-FPHlEx0DAGRGFqTxajEYzekunDjrw'),('2025-05-10 06:26:45.411000',907,32,'n01cvJtUaIRD3jMPMIsaPVkb2a9g0e_zr4quD1_2GMM'),('2025-05-10 06:49:27.684000',915,33,'E97dBAaDQJyqCNmX1ledFW4BaRuZ20iH6d2htmRqltk'),('2025-05-10 17:57:57.389000',1005,6,'NKf9B3ZJncuvNy8vrV3hiPiLieVAhN-YXrmrggu9-bI'),('2025-05-10 22:26:33.739000',1029,36,'8Ga8-FN9GfaNBSnrSnavwuacS5FcD1ZNAVvl4xN6KCg'),('2025-05-11 00:04:28.036000',1033,35,'e4SjZWgdCnn-b6NlD7g9f6HoXT60zforknT3qMDE7lQ'),('2025-05-11 00:06:17.905000',1035,37,'tntaLTJLwie8v4_6s5duI7BqG3yA7lVbCBguSbHNuDE'),('2025-05-11 02:08:22.525000',1040,34,'-bQ_o4kkdg2t_dnKkzUQEc4_WWdJdCQS62z7mRC6Iok'),('2025-05-11 01:05:05.760000',1044,5,'TwyzRRy8D4MrE33Vgv3j-Vnydmt_DobIr-bUCeEllqM'),('2025-05-11 06:30:00.186000',1049,39,'asYbQDCkvDK6Lb2M3YcVaqeH9v3ZS4a51DCilDR1dCg'),('2025-05-11 06:29:55.225000',1050,26,'EjTHIJvgxUlsblF6LWqQdqzwr-XHwqhQGp63hzsDb94'),('2025-05-11 04:52:50.845000',1053,2,'sGVLE4mG-ChYXLrLHwEduuTKxY49nc34oiT6QZ2GMiQ'),('2025-05-11 06:30:01.313000',1054,3,'hZ9G5-TOD4WiSoxMSIRAHuA4C6cWznPn4dDxg1679Fk');
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;

--
-- Table structure for table `scrap`
--

DROP TABLE IF EXISTS `scrap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scrap` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `target_id` bigint NOT NULL,
  `target_type` tinyint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgt91kwgqa4f4oaoi9ljgy75mw` (`user_id`),
  CONSTRAINT `FKgt91kwgqa4f4oaoi9ljgy75mw` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `scrap_chk_1` CHECK ((`target_type` between 0 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scrap`
--

/*!40000 ALTER TABLE `scrap` DISABLE KEYS */;
INSERT INTO `scrap` VALUES (34,'2025-04-10 06:38:34.656506','2025-04-10 06:38:34.656506',70,1,4),(35,'2025-04-10 06:39:09.980060','2025-04-10 06:39:09.980060',68,1,4),(36,'2025-04-10 06:39:32.176267','2025-04-10 06:39:32.176267',68,1,3),(38,'2025-04-10 06:40:12.899486','2025-04-10 06:40:12.899486',70,1,3),(40,'2025-04-10 12:46:39.762625','2025-04-10 12:46:39.762625',98,1,26),(41,'2025-04-10 22:15:01.000000','2025-04-10 22:15:04.000000',40,2,39),(42,'2025-04-10 22:15:25.000000','2025-04-10 22:15:26.000000',41,2,39),(44,'2025-04-10 22:15:56.000000','2025-04-10 22:15:57.000000',43,2,39),(45,'2025-04-10 22:18:56.000000','2025-04-10 22:18:57.000000',65,1,2),(46,'2025-04-10 22:19:18.000000','2025-04-10 22:19:18.000000',70,1,2),(47,'2025-04-10 22:19:30.000000','2025-04-10 22:19:31.000000',67,1,2),(48,'2025-04-10 22:19:42.000000','2025-04-10 22:19:42.000000',64,1,2),(50,'2025-04-11 00:19:35.772809','2025-04-11 00:19:35.772809',70,1,35),(51,'2025-04-11 00:34:47.772342','2025-04-11 00:34:47.772342',70,1,39),(54,'2025-04-11 04:42:12.615369','2025-04-11 04:42:12.615369',121,1,26);
/*!40000 ALTER TABLE `scrap` ENABLE KEYS */;

--
-- Table structure for table `summary`
--

DROP TABLE IF EXISTS `summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `summary` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `is_left` bit(1) NOT NULL,
  `debate_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkhyorj7l3brpjbnfevj4g1hbf` (`debate_id`),
  CONSTRAINT `FKkhyorj7l3brpjbnfevj4g1hbf` FOREIGN KEY (`debate_id`) REFERENCES `debate` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=519 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `summary`
--

/*!40000 ALTER TABLE `summary` DISABLE KEYS */;
INSERT INTO `summary` VALUES (204,'청소년의 건강한 성장과 범죄로부터의 보호를 위해 일정 시간 이후 외출을 제한해야 합니다.',0x01,61),(205,'야간은 사고와 유해환경에 노출되기 쉬운 시간대로, 청소년 보호를 위한 제한은 필수적입니다.',0x01,61),(206,'규칙적인 생활 습관 형성을 위해서는 야간 외출 제한이 장기적으로 도움이 될 수 있습니다.',0x01,61),(207,'흉악 범죄에 대한 강력한 처벌은 사회 질서를 유지하고 시민의 안전을 지키는 데 필요합니다.',0x01,62),(208,'사형제는 피해자 유가족에게 최소한의 정의를 제공하고 심리적 안정을 도모할 수 있습니다.',0x01,62),(209,'범죄 예방을 위한 억제력으로서 사형제는 현재 사회에서도 그 실효성이 입증되고 있습니다.',0x01,62),(210,'대학 등록금을 무상화하면 저소득층 학생들도 학업에 전념할 수 있는 환경이 조성됩니다.',0x01,63),(211,'경제적 부담을 줄이면 학생들은 아르바이트 대신 학습과 진로 탐색에 집중할 수 있습니다.',0x01,63),(212,'국가의 미래 인재 양성을 위해 고등교육 기회는 누구에게나 동등하게 제공되어야 합니다.',0x01,63),(213,'정년을 연장하면 축적된 경험과 전문성을 가진 고령 인력을 사회가 계속 활용할 수 있습니다.',0x01,64),(214,'고령화 사회에서 정년 연장은 노동력 부족 문제를 해결할 수 있는 현실적인 대안입니다.',0x01,64),(215,'퇴직 후 생계 문제를 겪는 고령자에게 정년 연장은 경제적 안정성을 제공할 수 있습니다.',0x01,64),(216,'주 4일제 도입은 근로자의 삶의 질을 향상시키고 일과 삶의 균형을 실현하는 계기가 됩니다.',0x01,65),(217,'근무일 감소는 업무 효율을 높이고 피로 누적을 방지해 장기적으로 생산성을 향상시킵니다.',0x01,65),(218,'짧은 근무일정은 가족 및 자기계발 시간 확보에 기여해 전반적인 삶의 만족도를 높입니다.',0x01,65),(222,'인터넷 실명제를 통해 악성 댓글과 허위 정보 유포를 근본적으로 차단할 수 있습니다.',0x01,67),(223,'실명제 도입은 책임 있는 온라인 문화 형성과 사회적 신뢰 회복에 도움이 됩니다.',0x01,67),(224,'사이버범죄 예방과 피해자 보호를 위해서라도 최소한의 실명 기반은 필요합니다.',0x01,67),(231,'반려동물 등록을 의무화하면 유기동물 방지와 책임감 있는 반려문화 확산에 기여합니다.',0x01,70),(232,'등록제도는 반려동물 보호와 정책 수립에 필요한 정확한 데이터를 제공합니다.',0x01,70),(233,'반려동물을 키우는 모든 시민이 공통된 의무를 지니는 문화가 조성될 수 있습니다.',0x01,70),(234,'청소년에게 일괄적으로 외출을 제한하는 것은 과도한 통제로 작용할 수 있습니다.',0x00,61),(235,'개인의 상황을 고려하지 않은 외출 제한은 불필요한 반발과 저항을 초래할 수 있습니다.',0x00,61),(236,'가정과 학교에서의 교육이 우선이며, 제도적 강제는 자유를 침해할 우려가 있습니다.',0x00,61),(237,'사형은 국가가 생명을 박탈하는 제도로, 인간의 존엄성을 훼손할 수 있습니다.',0x00,62),(238,'오판 가능성이 있는 현실에서 사형제는 되돌릴 수 없는 치명적 결과를 초래할 수 있습니다.',0x00,62),(239,'종신형과 같은 대체 형벌로도 충분히 사회로부터의 격리는 가능합니다.',0x00,62),(240,'무상 등록금은 막대한 예산이 필요해 장기적으로 재정 부담을 가중시킬 수 있습니다.',0x00,63),(241,'경제적 여유가 있는 계층까지 무상 혜택을 제공하는 것은 형평성에 어긋날 수 있습니다.',0x00,63),(242,'필요한 이들에게 맞춤형 장학금 제도를 강화하는 것이 더 효율적입니다.',0x00,63),(243,'정년 연장은 청년층의 취업 기회를 줄이고 세대 간 갈등을 심화시킬 수 있습니다.',0x00,64),(244,'고령 근로자의 업무 효율과 건강 문제는 조직 운영에 부담을 줄 수 있습니다.',0x00,64),(245,'변화하는 산업 구조에 맞춰 새로운 인재를 유입하는 것이 더 중요할 수 있습니다.',0x00,64),(246,'근무일 축소는 기업 운영에 부담을 주며 생산성 저하를 초래할 수 있습니다.',0x00,65),(247,'서비스업 등 주 4일제가 적용되기 어려운 업종에서 형평성 문제가 발생할 수 있습니다.',0x00,65),(248,'업무량은 그대로인 채 시간만 줄면 오히려 노동 강도가 심화될 수 있습니다.',0x00,65),(252,'실명 강제는 표현의 자유와 익명성이 보장해야 할 민주주의 원칙에 위배됩니다.',0x00,67),(253,'실명제는 소수 의견을 위축시키고 자유로운 토론 문화를 해칠 우려가 있습니다.',0x00,67),(254,'인터넷 실명제는 정부의 과도한 감시로 이어질 수 있어 신중한 접근이 필요합니다.',0x00,67),(261,'등록 의무화는 사생활 침해로 받아들여질 수 있으며 과도한 규제가 될 수 있습니다.',0x00,70),(262,'등록 및 관리 비용이 일부 가정에 경제적 부담으로 작용할 수 있습니다.',0x00,70),(263,'의무 등록보다 자율적 참여를 유도하는 방식이 반감을 줄일 수 있습니다.',0x00,70),(513,'대중교통은 모든 시민들이 필수적으로 이용하는 서비스이므로 기본요금을 무료화하여 경제적 부담을 줄여야 한다.',0x01,122),(514,'무료화로 인해 대중교통 이용률이 증가하고 자동차 이용량이 감소하여 교통 체증 문제를 완화할 수 있다.',0x01,122),(515,'저소득층이 대중교통을 무료로 이용할 수 있게 되면 사회적 격차를 줄일 수 있다.',0x01,122),(516,'대중교통 기본요금을 무료화하면 예산 부담이 커져 다른 사회복지 예산이 부족해질 수 있다.',0x00,122),(517,'무료화로 인해 대중교통 시스템이 지나치게 혼잡해져 서비스 품질이 저하될 우려가 있다.',0x00,122),(518,'무료화로 인해 정상적인 이용자들에게 불이익을 줄 수 있으며, 부정한 이용이 증가할 우려가 있다.',0x00,122);
/*!40000 ALTER TABLE `summary` ENABLE KEYS */;

--
-- Table structure for table `type_result`
--

DROP TABLE IF EXISTS `type_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_result` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `score1` int NOT NULL,
  `score2` int NOT NULL,
  `score3` int NOT NULL,
  `score4` int NOT NULL,
  `type1` enum('I','P') NOT NULL,
  `type2` enum('C','N') NOT NULL,
  `type3` enum('S','T') NOT NULL,
  `type4` enum('B','R') NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKchtvvl2dulhfwt9565446l5m8` (`user_id`),
  CONSTRAINT `FKchtvvl2dulhfwt9565446l5m8` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_result`
--

/*!40000 ALTER TABLE `type_result` DISABLE KEYS */;
INSERT INTO `type_result` VALUES (1,3,-2,3,3,'I','N','S','R',4),(2,1,3,-3,1,'I','C','T','R',3),(3,-1,2,3,1,'P','N','T','B',1),(4,2,2,1,3,'P','N','T','B',5),(5,-1,2,-1,3,'I','N','S','B',2),(6,1,3,2,3,'I','N','S','B',6),(10,-1,1,-1,1,'P','C','T','R',26),(11,1,-1,1,3,'I','N','S','R',35),(12,1,-1,1,1,'I','N','S','R',34),(13,-2,-3,1,2,'P','N','S','R',39);
/*!40000 ALTER TABLE `type_result` ENABLE KEYS */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `year_of_birth` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `nickname` varchar(10) NOT NULL,
  `email` varchar(40) DEFAULT NULL,
  `s3_key` varchar(255) NOT NULL,
  `age_range` enum('FIFTY','FORTY','TEN','THIRTY','TWENTY') NOT NULL,
  `gender` enum('FEMALE','MALE','NONE') NOT NULL,
  `region` enum('BUSAN','CHUNGBUK','CHUNGNAM','DAEGU','DAEJEON','GANGWON','GWANGJU','GYEONGBUK','GYEONGGI','GYEONGNAM','INCHEON','JEJU','JEONBUK','JEONNAM','SEJONG','SEOUL','ULSAN') NOT NULL,
  `religion` enum('BUDDHISM','CATHOLIC','CHRISTIAN','NONE','OTHER') DEFAULT NULL,
  `social_type` enum('GOOGLE','KAKAO') NOT NULL,
  `state` enum('ACTIVE','ADMIN','INACTIVE','LEAVE') DEFAULT NULL,
  `type` enum('ICSB','ICSR','ICTB','ICTR','INSB','INSR','INTB','INTR','PCSB','PCSR','PCTB','PCTR','PNSB','PNSR','PNTB','PNTR') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKn4swgcf30j6bmtb4l4cjryuym` (`nickname`),
  UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1999,'2025-03-25 12:47:48.135262',1,'2025-03-25 14:20:12.029170','윤다은1호팬','syoon4486@gmail.com','profile/0c643827-c958-465b-875d-918c8a22fe01.png','TWENTY','FEMALE','SEOUL','CHRISTIAN','GOOGLE','ACTIVE','INSB'),(1073741824,'2025-03-25 17:44:59.707583',2,'2025-03-25 17:44:59.707583','eezi','dldmswl956@gmail.com','profile/gyodong2.jpg','FIFTY','MALE','SEOUL','NONE','GOOGLE','ADMIN','INSB'),(2000,'2025-04-01 18:32:47.000000',3,'2025-04-08 02:27:13.447335','반짝이는코알라','test@test.com','profile/leegunhee.jpg','TWENTY','MALE','SEOUL','NONE','GOOGLE','ADMIN','ICTR'),(2000,'2025-04-01 18:32:48.000000',4,'2025-04-01 02:12:48.090621','무거운델피니움','test2@test.com','profile/image33.png','TWENTY','FEMALE','BUSAN','BUDDHISM','GOOGLE','ACTIVE','INSR'),(2000,'2025-04-06 18:32:49.000000',5,'2025-04-07 18:32:37.000000','다크나이트','test3@test.com','profile/honggildong.jpg','TWENTY','MALE','SEOUL','CHRISTIAN','GOOGLE','ADMIN','PNTB'),(2000,'2025-04-07 11:14:49.000000',6,'2025-04-07 11:14:54.000000','떵우기','sjh2395@gmail.com\n','profile/cat.jpg','TWENTY','MALE','SEOUL','CHRISTIAN','GOOGLE','ACTIVE','INSR'),(1995,'2025-04-10 01:24:17.699791',26,'2025-04-10 06:56:35.619675','주노주노','respectwo@gmail.com','profile/ddung2.jpg','THIRTY','MALE','SEOUL','BUDDHISM','GOOGLE','ACTIVE','PCTR'),(1997,'2025-04-10 11:23:10.909346',34,'2025-04-10 12:47:55.535107','애프터썬','alscjf4104@gmail.com','profile/0c643827-c958-465b-875d-918c8a22fe01.png','TWENTY','MALE','SEOUL','BUDDHISM','GOOGLE','ADMIN','INSR'),(1998,'2025-04-10 11:29:27.894204',35,'2025-04-10 11:34:40.845159','플라잉고릴라','baesj1044@gmail.com','profile/0c643827-c958-465b-875d-918c8a22fe01.png','TWENTY','FEMALE','JEJU','BUDDHISM','GOOGLE','ADMIN','INSR'),(1999,'2025-04-11 00:08:40.998416',39,'2025-04-11 02:14:30.967750','주노플로','wkndnight23@gmail.com','profile/ddung2.jpg','TWENTY','MALE','SEOUL','NONE','GOOGLE','ACTIVE','PNSR');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

--
-- Table structure for table `user_device`
--

DROP TABLE IF EXISTS `user_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_device` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) DEFAULT NULL,
  `device_type` varchar(255) DEFAULT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd2lb0k09c4nnfpvku8r61g92n` (`user_id`),
  CONSTRAINT `FKd2lb0k09c4nnfpvku8r61g92n` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_device`
--

/*!40000 ALTER TABLE `user_device` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_device` ENABLE KEYS */;

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vote` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `age_range` enum('FIFTY','FORTY','TEN','THIRTY','TWENTY') NOT NULL,
  `gender` enum('FEMALE','MALE','NONE') NOT NULL,
  `is_left` bit(1) NOT NULL,
  `region` enum('BUSAN','CHUNGBUK','CHUNGNAM','DAEGU','DAEJEON','GANGWON','GWANGJU','GYEONGBUK','GYEONGGI','GYEONGNAM','INCHEON','JEJU','JEONBUK','JEONNAM','SEJONG','SEOUL','ULSAN') NOT NULL,
  `religion` enum('BUDDHISM','CATHOLIC','CHRISTIAN','NONE','OTHER') NOT NULL,
  `type` enum('COMMON','ICSB','ICSR','ICTB','ICTR','INSB','INSR','INTB','INTR','PCSB','PCSR','PCTB','PCTR','PNSB','PNSR','PNTB','PNTR') DEFAULT NULL,
  `debate_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKc9uss2u3fwovtoyywflfqqpai` (`debate_id`),
  KEY `FKcsaksoe2iepaj8birrmithwve` (`user_id`),
  CONSTRAINT `FKc9uss2u3fwovtoyywflfqqpai` FOREIGN KEY (`debate_id`) REFERENCES `debate` (`id`),
  CONSTRAINT `FKcsaksoe2iepaj8birrmithwve` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=548 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote`
--

/*!40000 ALTER TABLE `vote` DISABLE KEYS */;
INSERT INTO `vote` VALUES (36,'TEN','MALE',0x01,'GYEONGGI','NONE','ICTR',70,NULL),(37,'FORTY','MALE',0x01,'GYEONGGI','OTHER','ICTR',70,NULL),(38,'FIFTY','MALE',0x01,'GYEONGGI','NONE','ICTR',70,NULL),(39,'THIRTY','FEMALE',0x01,'GYEONGGI','CATHOLIC','ICTR',70,NULL),(40,'THIRTY','FEMALE',0x01,'GYEONGGI','BUDDHISM','ICTR',70,NULL),(41,'FORTY','FEMALE',0x01,'GYEONGGI','BUDDHISM','ICTR',70,NULL),(42,'THIRTY','FEMALE',0x01,'GYEONGGI','CATHOLIC','ICTR',70,NULL),(43,'FIFTY','MALE',0x01,'GYEONGGI','BUDDHISM','ICTR',70,NULL),(44,'FORTY','FEMALE',0x01,'GYEONGGI','CHRISTIAN','ICTR',70,NULL),(45,'TEN','MALE',0x01,'GYEONGGI','NONE','ICTR',70,NULL),(46,'TWENTY','MALE',0x01,'GYEONGGI','CHRISTIAN','ICTR',70,NULL),(47,'THIRTY','MALE',0x01,'GYEONGGI','OTHER','INTB',70,NULL),(48,'THIRTY','MALE',0x01,'GYEONGGI','BUDDHISM','INTB',70,NULL),(49,'TWENTY','MALE',0x01,'GYEONGGI','NONE','INTB',70,NULL),(50,'TWENTY','FEMALE',0x01,'GYEONGNAM','CATHOLIC','INTB',70,NULL),(51,'TEN','FEMALE',0x01,'GYEONGNAM','BUDDHISM','INTB',70,NULL),(52,'THIRTY','MALE',0x01,'GYEONGNAM','NONE','INTB',70,NULL),(53,'TWENTY','MALE',0x01,'GYEONGNAM','BUDDHISM','INTB',70,NULL),(54,'TWENTY','MALE',0x01,'GYEONGNAM','NONE','INTB',70,NULL),(55,'TWENTY','MALE',0x01,'GYEONGNAM','NONE','INTB',70,NULL),(56,'FIFTY','FEMALE',0x01,'GYEONGNAM','NONE','INTB',70,NULL),(57,'THIRTY','MALE',0x01,'GYEONGNAM','NONE','INTB',70,NULL),(58,'TEN','MALE',0x01,'SEOUL','BUDDHISM','INTB',70,NULL),(59,'FIFTY','MALE',0x01,'SEOUL','OTHER','INTB',70,NULL),(60,'FORTY','MALE',0x01,'SEOUL','NONE','INTB',70,NULL),(61,'TWENTY','MALE',0x01,'SEOUL','OTHER','PCTR',70,NULL),(62,'TWENTY','MALE',0x01,'SEOUL','CATHOLIC','PCTR',70,NULL),(63,'TWENTY','MALE',0x01,'SEOUL','NONE','PCTR',70,NULL),(64,'THIRTY','FEMALE',0x01,'SEOUL','BUDDHISM','PCTR',70,NULL),(65,'FORTY','FEMALE',0x01,'SEOUL','BUDDHISM','PCTR',70,NULL),(66,'THIRTY','FEMALE',0x00,'SEOUL','CHRISTIAN','PCTR',70,NULL),(67,'FIFTY','FEMALE',0x00,'SEOUL','OTHER','PCTR',70,NULL),(68,'TWENTY','FEMALE',0x00,'SEOUL','CATHOLIC','PCTR',70,NULL),(69,'FIFTY','FEMALE',0x00,'SEOUL','OTHER','PCTR',70,NULL),(70,'TWENTY','MALE',0x00,'SEOUL','BUDDHISM','PCTR',70,NULL),(71,'FORTY','MALE',0x00,'SEOUL','OTHER','PCTR',70,NULL),(72,'FORTY','FEMALE',0x00,'SEOUL','BUDDHISM','PCTR',70,NULL),(73,'TEN','FEMALE',0x00,'SEOUL','NONE','PCTR',70,NULL),(74,'TEN','MALE',0x00,'SEOUL','OTHER','PCTR',70,NULL),(75,'TWENTY','FEMALE',0x00,'SEOUL','OTHER','PCTR',70,NULL),(76,'TWENTY','MALE',0x00,'SEOUL','CATHOLIC','PCTR',70,NULL),(77,'TEN','FEMALE',0x00,'SEOUL','BUDDHISM','PCTR',70,NULL),(78,'TWENTY','MALE',0x00,'SEOUL','OTHER','PCTR',70,NULL),(79,'FORTY','MALE',0x00,'SEOUL','NONE','PCTR',70,NULL),(80,'FORTY','FEMALE',0x00,'SEOUL','NONE','PCTR',70,NULL),(81,'FORTY','FEMALE',0x00,'SEOUL','CATHOLIC','INSB',70,NULL),(82,'TWENTY','FEMALE',0x00,'SEOUL','NONE','PNSB',70,NULL),(83,'FIFTY','FEMALE',0x00,'SEOUL','OTHER','PNSB',70,NULL),(84,'FORTY','MALE',0x00,'SEOUL','NONE','PNSB',70,NULL),(85,'THIRTY','FEMALE',0x00,'SEOUL','CHRISTIAN','PNSB',70,NULL),(86,'TWENTY','FEMALE',0x00,'SEOUL','NONE','PNSB',70,NULL),(87,'TEN','FEMALE',0x00,'SEOUL','CATHOLIC','PNSB',70,NULL),(88,'TEN','MALE',0x00,'SEOUL','CATHOLIC','PNSB',70,NULL),(89,'TWENTY','MALE',0x00,'SEOUL','CATHOLIC','PNSB',70,NULL),(90,'TEN','FEMALE',0x00,'SEOUL','CHRISTIAN','PNSB',70,NULL),(91,'FIFTY','FEMALE',0x00,'SEOUL','BUDDHISM','PNSB',70,NULL),(92,'FORTY','FEMALE',0x00,'SEOUL','NONE','PNSB',70,NULL),(93,'FORTY','MALE',0x00,'SEOUL','BUDDHISM','PNSB',70,NULL),(94,'FIFTY','FEMALE',0x00,'SEOUL','OTHER','PNSB',70,NULL),(95,'TWENTY','MALE',0x00,'SEOUL','OTHER','PNSB',70,NULL),(96,'FIFTY','MALE',0x00,'SEOUL','BUDDHISM','PNSB',70,NULL),(97,'THIRTY','MALE',0x00,'ULSAN','BUDDHISM','PNSB',70,NULL),(98,'THIRTY','FEMALE',0x00,'ULSAN','NONE','ICSR',70,NULL),(99,'FORTY','FEMALE',0x00,'ULSAN','NONE','ICTB',70,NULL),(100,'TWENTY','FEMALE',0x00,'ULSAN','NONE','INTB',70,NULL),(101,'TWENTY','FEMALE',0x00,'ULSAN','OTHER','COMMON',70,NULL),(102,'FIFTY','FEMALE',0x00,'ULSAN','CHRISTIAN','PCSB',70,NULL),(103,'THIRTY','MALE',0x00,'ULSAN','NONE','COMMON',70,NULL),(104,'TWENTY','FEMALE',0x00,'ULSAN','CHRISTIAN','PNSB',70,NULL),(105,'FIFTY','FEMALE',0x00,'ULSAN','CATHOLIC','ICSR',70,NULL),(106,'FORTY','FEMALE',0x00,'ULSAN','CHRISTIAN','PNSR',70,NULL),(107,'FIFTY','FEMALE',0x00,'GYEONGNAM','CATHOLIC','PCSR',70,NULL),(108,'FORTY','FEMALE',0x00,'CHUNGBUK','CHRISTIAN','INTR',70,NULL),(109,'TWENTY','MALE',0x00,'JEONNAM','NONE','PCSR',70,NULL),(110,'THIRTY','FEMALE',0x00,'ULSAN','CHRISTIAN','ICTB',70,NULL),(111,'TEN','FEMALE',0x00,'CHUNGNAM','BUDDHISM','ICSB',70,NULL),(112,'TEN','MALE',0x00,'DAEGU','BUDDHISM','PNTR',70,NULL),(113,'FORTY','FEMALE',0x00,'SEOUL','BUDDHISM','INSR',70,NULL),(114,'FORTY','FEMALE',0x00,'CHUNGNAM','NONE','INSB',70,NULL),(115,'FIFTY','FEMALE',0x00,'CHUNGNAM','CATHOLIC','PCSB',70,NULL),(116,'THIRTY','FEMALE',0x00,'BUSAN','NONE','PCSB',70,NULL),(117,'FIFTY','FEMALE',0x00,'BUSAN','CATHOLIC','PNTB',70,NULL),(118,'TWENTY','FEMALE',0x00,'GYEONGBUK','BUDDHISM','ICTB',70,NULL),(119,'FORTY','FEMALE',0x00,'DAEGU','CHRISTIAN','PNSB',70,NULL),(120,'FORTY','FEMALE',0x00,'CHUNGNAM','NONE','ICSR',70,NULL),(121,'TWENTY','FEMALE',0x00,'BUSAN','OTHER','ICSR',70,NULL),(122,'FIFTY','FEMALE',0x00,'ULSAN','CHRISTIAN','PNSB',70,NULL),(123,'FIFTY','FEMALE',0x00,'GANGWON','OTHER','INSR',70,NULL),(124,'THIRTY','FEMALE',0x00,'JEONBUK','CHRISTIAN','PCTB',70,NULL),(125,'FORTY','FEMALE',0x00,'GYEONGNAM','OTHER','PNTB',70,NULL),(126,'TEN','FEMALE',0x00,'ULSAN','BUDDHISM','PCTB',70,NULL),(127,'THIRTY','FEMALE',0x00,'DAEJEON','NONE','PCSB',70,NULL),(128,'FORTY','FEMALE',0x00,'GWANGJU','BUDDHISM','INSB',70,NULL),(129,'FORTY','MALE',0x00,'JEONNAM','CATHOLIC','PCSR',70,NULL),(130,'FORTY','FEMALE',0x00,'DAEGU','CHRISTIAN','PCTR',70,NULL),(131,'THIRTY','MALE',0x00,'JEJU','CATHOLIC','PNSB',70,NULL),(132,'FIFTY','MALE',0x00,'GANGWON','BUDDHISM','INTB',70,NULL),(133,'FORTY','FEMALE',0x00,'INCHEON','CHRISTIAN','PNTR',70,NULL),(134,'TWENTY','FEMALE',0x00,'GYEONGBUK','CHRISTIAN','PCSB',70,NULL),(135,'TWENTY','FEMALE',0x00,'DAEGU','OTHER','PNTB',70,NULL),(138,'THIRTY','MALE',0x01,'SEOUL','BUDDHISM','PCSR',70,26),(139,'THIRTY','MALE',0x00,'SEOUL','BUDDHISM','PCTR',67,26),(241,'FORTY','FEMALE',0x01,'JEJU','OTHER','ICTB',67,NULL),(242,'TEN','MALE',0x01,'GYEONGBUK','CHRISTIAN','INSB',67,NULL),(243,'TWENTY','MALE',0x01,'GANGWON','CHRISTIAN','COMMON',67,NULL),(244,'TEN','FEMALE',0x01,'ULSAN','CATHOLIC','INSR',67,NULL),(245,'THIRTY','MALE',0x01,'CHUNGNAM','BUDDHISM','INTR',67,NULL),(246,'FIFTY','FEMALE',0x01,'DAEGU','OTHER','INSR',67,NULL),(247,'TEN','FEMALE',0x01,'DAEGU','CHRISTIAN','ICSB',67,NULL),(248,'FORTY','FEMALE',0x01,'CHUNGBUK','CATHOLIC','PNSR',67,NULL),(249,'TEN','FEMALE',0x01,'GYEONGNAM','NONE','ICTB',67,NULL),(250,'TEN','MALE',0x01,'DAEJEON','BUDDHISM','ICSB',67,NULL),(251,'FIFTY','FEMALE',0x01,'ULSAN','BUDDHISM','PNTB',67,NULL),(252,'TWENTY','FEMALE',0x01,'ULSAN','NONE','PCTR',67,NULL),(253,'FIFTY','FEMALE',0x01,'GWANGJU','CHRISTIAN','ICSR',67,NULL),(254,'FIFTY','FEMALE',0x01,'JEJU','CATHOLIC','INTR',67,NULL),(255,'TEN','FEMALE',0x01,'CHUNGNAM','CATHOLIC','PCTR',67,NULL),(256,'TWENTY','FEMALE',0x01,'GYEONGNAM','CHRISTIAN','COMMON',67,NULL),(257,'THIRTY','MALE',0x01,'BUSAN','NONE','PNSB',67,NULL),(258,'TWENTY','MALE',0x01,'BUSAN','OTHER','PCSB',67,NULL),(259,'THIRTY','FEMALE',0x01,'GANGWON','BUDDHISM','ICTR',67,NULL),(260,'FIFTY','FEMALE',0x01,'JEONBUK','CHRISTIAN','PCSB',67,NULL),(261,'TWENTY','FEMALE',0x01,'BUSAN','OTHER','PNTR',67,NULL),(262,'THIRTY','MALE',0x01,'GYEONGNAM','BUDDHISM','PCTR',67,NULL),(263,'FIFTY','FEMALE',0x01,'DAEJEON','OTHER','PCSR',67,NULL),(264,'FORTY','MALE',0x01,'GYEONGBUK','CHRISTIAN','ICSR',67,NULL),(265,'THIRTY','FEMALE',0x01,'GWANGJU','NONE','INTB',67,NULL),(266,'TWENTY','MALE',0x01,'SEOUL','CATHOLIC','ICSB',67,NULL),(267,'TEN','MALE',0x01,'CHUNGNAM','CHRISTIAN','ICTR',67,NULL),(268,'TEN','MALE',0x01,'GWANGJU','OTHER','ICTR',67,NULL),(269,'TEN','MALE',0x01,'ULSAN','CATHOLIC','INTB',67,NULL),(270,'TWENTY','MALE',0x01,'BUSAN','CHRISTIAN','INTB',67,NULL),(271,'FORTY','FEMALE',0x01,'JEJU','BUDDHISM','PNTR',67,NULL),(272,'TWENTY','FEMALE',0x01,'DAEGU','BUDDHISM','PNTR',67,NULL),(273,'FORTY','FEMALE',0x01,'DAEGU','BUDDHISM','ICSB',67,NULL),(274,'TWENTY','FEMALE',0x01,'GYEONGNAM','NONE','PNSR',67,NULL),(275,'THIRTY','FEMALE',0x01,'JEONBUK','CATHOLIC','INTB',67,NULL),(276,'FORTY','FEMALE',0x01,'SEJONG','CHRISTIAN','INSB',67,NULL),(277,'TEN','FEMALE',0x01,'GWANGJU','BUDDHISM','COMMON',67,NULL),(278,'THIRTY','MALE',0x01,'SEJONG','OTHER','ICSB',67,NULL),(279,'FIFTY','MALE',0x01,'JEONBUK','BUDDHISM','PNSB',67,NULL),(280,'FIFTY','MALE',0x01,'SEJONG','OTHER','ICSR',67,NULL),(281,'TEN','FEMALE',0x01,'DAEGU','CATHOLIC','PNSB',67,NULL),(282,'FIFTY','FEMALE',0x01,'GYEONGNAM','CHRISTIAN','PNTB',67,NULL),(283,'FIFTY','MALE',0x01,'BUSAN','NONE','PNTR',67,NULL),(284,'FORTY','MALE',0x01,'INCHEON','BUDDHISM','ICTB',67,NULL),(285,'TWENTY','MALE',0x01,'JEONNAM','OTHER','ICSB',67,NULL),(286,'THIRTY','FEMALE',0x01,'GYEONGGI','CATHOLIC','PNSR',67,NULL),(287,'FIFTY','FEMALE',0x01,'DAEJEON','CHRISTIAN','ICSR',67,NULL),(288,'THIRTY','FEMALE',0x01,'GWANGJU','BUDDHISM','ICTB',67,NULL),(289,'THIRTY','FEMALE',0x01,'BUSAN','BUDDHISM','PCTB',67,NULL),(290,'FORTY','MALE',0x01,'SEOUL','NONE','INSR',67,NULL),(291,'TEN','FEMALE',0x01,'GYEONGBUK','CHRISTIAN','INSR',67,NULL),(292,'TEN','FEMALE',0x01,'GYEONGGI','OTHER','PCSR',67,NULL),(293,'FORTY','FEMALE',0x01,'CHUNGBUK','CATHOLIC','PNTB',67,NULL),(294,'THIRTY','MALE',0x01,'JEONNAM','CATHOLIC','INTB',67,NULL),(295,'FORTY','FEMALE',0x01,'GYEONGGI','CATHOLIC','PNTR',67,NULL),(296,'FORTY','FEMALE',0x01,'CHUNGBUK','OTHER','INSB',67,NULL),(297,'FORTY','FEMALE',0x01,'SEJONG','CHRISTIAN','PNSB',67,NULL),(298,'FORTY','FEMALE',0x01,'JEONNAM','OTHER','ICTB',67,NULL),(299,'TWENTY','FEMALE',0x01,'GWANGJU','NONE','INSR',67,NULL),(300,'FORTY','FEMALE',0x01,'INCHEON','NONE','ICTR',67,NULL),(301,'TEN','MALE',0x00,'ULSAN','OTHER','ICTB',67,NULL),(302,'TEN','FEMALE',0x00,'GYEONGNAM','BUDDHISM','PCTB',67,NULL),(303,'THIRTY','MALE',0x00,'INCHEON','BUDDHISM','PNTB',67,NULL),(304,'TEN','MALE',0x00,'JEONBUK','CHRISTIAN','PCSB',67,NULL),(305,'THIRTY','MALE',0x00,'GYEONGBUK','CHRISTIAN','INTR',67,NULL),(306,'FORTY','FEMALE',0x00,'JEONNAM','BUDDHISM','ICTB',67,NULL),(307,'FIFTY','FEMALE',0x00,'JEONNAM','OTHER','PCTB',67,NULL),(308,'FORTY','FEMALE',0x00,'DAEJEON','BUDDHISM','PNSB',67,NULL),(309,'FIFTY','MALE',0x00,'SEOUL','OTHER','PNSB',67,NULL),(310,'THIRTY','MALE',0x00,'JEONNAM','CHRISTIAN','PNTB',67,NULL),(311,'TEN','FEMALE',0x00,'GWANGJU','OTHER','PNSR',67,NULL),(312,'TWENTY','MALE',0x00,'SEJONG','BUDDHISM','PCSR',67,NULL),(313,'FORTY','FEMALE',0x00,'INCHEON','CHRISTIAN','ICTB',67,NULL),(314,'THIRTY','FEMALE',0x00,'DAEGU','CATHOLIC','INTR',67,NULL),(315,'TWENTY','FEMALE',0x00,'BUSAN','CHRISTIAN','PNSB',67,NULL),(316,'TWENTY','FEMALE',0x00,'INCHEON','CHRISTIAN','ICSB',67,NULL),(317,'THIRTY','MALE',0x00,'GYEONGNAM','CHRISTIAN','PCTR',67,NULL),(318,'TWENTY','FEMALE',0x00,'JEJU','BUDDHISM','PCSR',67,NULL),(319,'FIFTY','MALE',0x00,'JEONBUK','NONE','ICSR',67,NULL),(320,'TEN','MALE',0x00,'JEONBUK','BUDDHISM','ICTR',67,NULL),(321,'TEN','FEMALE',0x00,'GANGWON','CHRISTIAN','INTB',67,NULL),(322,'THIRTY','FEMALE',0x00,'GYEONGBUK','OTHER','ICTR',67,NULL),(323,'TWENTY','MALE',0x00,'CHUNGBUK','NONE','ICTB',67,NULL),(324,'FIFTY','FEMALE',0x00,'GYEONGNAM','CHRISTIAN','COMMON',67,NULL),(325,'FORTY','FEMALE',0x00,'JEJU','BUDDHISM','INSR',67,NULL),(326,'FORTY','MALE',0x00,'DAEGU','CATHOLIC','COMMON',67,NULL),(327,'TWENTY','FEMALE',0x00,'DAEGU','NONE','PNTB',67,NULL),(328,'FORTY','MALE',0x00,'DAEJEON','BUDDHISM','ICSB',67,NULL),(329,'TWENTY','FEMALE',0x00,'INCHEON','OTHER','INSR',67,NULL),(330,'FIFTY','FEMALE',0x00,'CHUNGNAM','BUDDHISM','PCSR',67,NULL),(331,'TEN','MALE',0x00,'JEJU','CATHOLIC','INTB',67,NULL),(332,'TEN','MALE',0x00,'JEJU','BUDDHISM','PCSR',67,NULL),(333,'THIRTY','FEMALE',0x00,'JEONBUK','CATHOLIC','INTR',67,NULL),(334,'TEN','FEMALE',0x00,'JEONBUK','NONE','PCTR',67,NULL),(335,'THIRTY','FEMALE',0x00,'CHUNGBUK','BUDDHISM','INSR',67,NULL),(336,'TWENTY','MALE',0x00,'CHUNGBUK','OTHER','ICTR',67,NULL),(337,'FIFTY','MALE',0x00,'ULSAN','NONE','INTR',67,NULL),(338,'FIFTY','FEMALE',0x00,'DAEGU','CHRISTIAN','COMMON',67,NULL),(339,'TWENTY','FEMALE',0x00,'JEJU','OTHER','ICTB',67,NULL),(340,'FORTY','FEMALE',0x00,'ULSAN','BUDDHISM','ICSR',67,NULL),(341,'TWENTY','MALE',0x01,'SEOUL','NONE','ICTR',67,3),(342,'TEN','FEMALE',0x01,'SEOUL','BUDDHISM','ICSB',65,NULL),(343,'TEN','FEMALE',0x01,'SEOUL','OTHER','ICSB',65,NULL),(344,'TEN','FEMALE',0x01,'SEOUL','BUDDHISM','ICSB',65,NULL),(345,'FORTY','MALE',0x01,'SEOUL','CATHOLIC','ICSB',65,NULL),(346,'THIRTY','FEMALE',0x01,'SEOUL','NONE','ICSB',65,NULL),(347,'FIFTY','FEMALE',0x01,'SEOUL','NONE','ICSB',65,NULL),(348,'FIFTY','MALE',0x01,'SEOUL','BUDDHISM','ICSB',65,NULL),(349,'TWENTY','MALE',0x01,'SEOUL','BUDDHISM','ICSB',65,NULL),(350,'FIFTY','FEMALE',0x01,'SEOUL','CATHOLIC','ICSB',65,NULL),(351,'TWENTY','FEMALE',0x01,'SEOUL','OTHER','ICSB',65,NULL),(352,'THIRTY','MALE',0x01,'SEOUL','CHRISTIAN','ICSB',65,NULL),(353,'TEN','FEMALE',0x01,'SEOUL','CATHOLIC','ICSB',65,NULL),(354,'FORTY','FEMALE',0x01,'SEOUL','CHRISTIAN','ICSB',65,NULL),(355,'FIFTY','FEMALE',0x01,'SEOUL','CATHOLIC','ICSB',65,NULL),(356,'FIFTY','FEMALE',0x01,'SEOUL','CATHOLIC','ICSB',65,NULL),(357,'TEN','FEMALE',0x01,'SEOUL','CHRISTIAN','ICSB',65,NULL),(358,'TEN','MALE',0x01,'GYEONGNAM','CATHOLIC','ICSB',65,NULL),(359,'THIRTY','MALE',0x01,'GYEONGNAM','CHRISTIAN','ICSB',65,NULL),(360,'FORTY','FEMALE',0x01,'GYEONGNAM','NONE','ICSB',65,NULL),(361,'TWENTY','FEMALE',0x01,'GYEONGNAM','BUDDHISM','ICSB',65,NULL),(362,'TEN','FEMALE',0x01,'GYEONGNAM','BUDDHISM','ICSB',65,NULL),(363,'THIRTY','MALE',0x01,'GYEONGNAM','OTHER','ICSB',65,NULL),(364,'TWENTY','FEMALE',0x01,'GYEONGNAM','BUDDHISM','ICSB',65,NULL),(365,'FORTY','MALE',0x01,'GYEONGNAM','CHRISTIAN','ICSB',65,NULL),(366,'FIFTY','FEMALE',0x01,'GYEONGNAM','CATHOLIC','ICSB',65,NULL),(367,'FIFTY','MALE',0x01,'GYEONGNAM','CATHOLIC','ICSB',65,NULL),(368,'FIFTY','FEMALE',0x01,'GYEONGNAM','NONE','ICSB',65,NULL),(369,'TEN','FEMALE',0x01,'GYEONGNAM','NONE','ICSB',65,NULL),(370,'FORTY','FEMALE',0x01,'GYEONGNAM','CHRISTIAN','ICSB',65,NULL),(371,'TWENTY','MALE',0x01,'GYEONGGI','BUDDHISM','ICSB',65,NULL),(372,'THIRTY','MALE',0x01,'GYEONGGI','NONE','ICSB',65,NULL),(373,'TEN','MALE',0x01,'GYEONGGI','NONE','ICSB',65,NULL),(374,'THIRTY','MALE',0x01,'GYEONGGI','CHRISTIAN','ICSB',65,NULL),(375,'TWENTY','FEMALE',0x01,'GYEONGGI','CATHOLIC','PNSB',65,NULL),(376,'FIFTY','FEMALE',0x01,'GYEONGGI','BUDDHISM','PNSB',65,NULL),(377,'TWENTY','MALE',0x01,'GYEONGGI','CHRISTIAN','PNSB',65,NULL),(378,'THIRTY','MALE',0x01,'GYEONGGI','NONE','PNSB',65,NULL),(379,'THIRTY','MALE',0x01,'GYEONGGI','CHRISTIAN','PNSB',65,NULL),(380,'TWENTY','MALE',0x01,'GYEONGGI','BUDDHISM','PNSB',65,NULL),(381,'FORTY','FEMALE',0x01,'GYEONGGI','NONE','PNSB',65,NULL),(382,'THIRTY','MALE',0x01,'JEJU','CHRISTIAN','PNSB',65,NULL),(383,'FIFTY','MALE',0x01,'GYEONGNAM','NONE','PNSB',65,NULL),(384,'FORTY','FEMALE',0x01,'ULSAN','BUDDHISM','PNSB',65,NULL),(385,'TWENTY','MALE',0x01,'JEONBUK','CHRISTIAN','PNSB',65,NULL),(386,'TEN','FEMALE',0x01,'CHUNGBUK','NONE','PNSB',65,NULL),(387,'FIFTY','FEMALE',0x01,'JEJU','CATHOLIC','PNSB',65,NULL),(388,'THIRTY','MALE',0x01,'CHUNGNAM','CATHOLIC','PNSB',65,NULL),(389,'TWENTY','MALE',0x01,'ULSAN','BUDDHISM','PNSB',65,NULL),(390,'FIFTY','FEMALE',0x01,'JEONBUK','BUDDHISM','PNSB',65,NULL),(391,'TEN','FEMALE',0x01,'JEONBUK','CHRISTIAN','PNSB',65,NULL),(392,'TWENTY','MALE',0x01,'SEJONG','BUDDHISM','PCSR',65,NULL),(393,'TEN','MALE',0x01,'JEJU','CATHOLIC','PCSR',65,NULL),(394,'THIRTY','FEMALE',0x01,'SEJONG','CHRISTIAN','PCSR',65,NULL),(395,'THIRTY','FEMALE',0x01,'JEJU','OTHER','PCSR',65,NULL),(396,'TEN','FEMALE',0x01,'GYEONGGI','CATHOLIC','PCSR',65,NULL),(397,'TWENTY','FEMALE',0x01,'GYEONGGI','CHRISTIAN','PCSR',65,NULL),(398,'THIRTY','FEMALE',0x01,'GYEONGGI','NONE','PCSR',65,NULL),(399,'THIRTY','MALE',0x01,'GYEONGGI','NONE','PCSR',65,NULL),(400,'FORTY','MALE',0x01,'GYEONGGI','CHRISTIAN','PCSR',65,NULL),(401,'FIFTY','MALE',0x01,'GYEONGGI','OTHER','PCSR',65,NULL),(402,'FORTY','MALE',0x01,'GYEONGGI','CATHOLIC','PCSR',65,NULL),(403,'TWENTY','FEMALE',0x01,'SEOUL','BUDDHISM','PCSR',65,NULL),(404,'THIRTY','MALE',0x01,'SEOUL','NONE','PCSR',65,NULL),(405,'TEN','FEMALE',0x01,'SEOUL','CATHOLIC','PCSR',65,NULL),(406,'THIRTY','FEMALE',0x01,'SEOUL','CHRISTIAN','PCSR',65,NULL),(407,'TWENTY','FEMALE',0x01,'SEOUL','CHRISTIAN','PCSR',65,NULL),(408,'THIRTY','MALE',0x01,'SEOUL','NONE','PCSR',65,NULL),(409,'TEN','FEMALE',0x01,'SEOUL','NONE','PCSR',65,NULL),(410,'THIRTY','MALE',0x01,'SEOUL','CATHOLIC','PCSR',65,NULL),(411,'FIFTY','FEMALE',0x01,'SEOUL','CHRISTIAN','PCSR',65,NULL),(412,'TEN','MALE',0x01,'SEOUL','CATHOLIC','PCSR',65,NULL),(413,'TEN','MALE',0x01,'SEOUL','CHRISTIAN','PCSR',65,NULL),(414,'FIFTY','MALE',0x01,'SEOUL','NONE','PCSR',65,NULL),(415,'TWENTY','MALE',0x01,'SEOUL','BUDDHISM','ICSB',65,NULL),(416,'TEN','MALE',0x01,'SEOUL','NONE','ICSB',65,NULL),(417,'TEN','MALE',0x01,'SEOUL','NONE','ICSB',65,NULL),(418,'THIRTY','FEMALE',0x01,'SEOUL','NONE','ICSB',65,NULL),(419,'TEN','FEMALE',0x01,'SEOUL','CHRISTIAN','ICSB',65,NULL),(420,'FIFTY','MALE',0x01,'SEOUL','CATHOLIC','INSR',65,NULL),(421,'FORTY','MALE',0x01,'SEOUL','CHRISTIAN','ICSR',65,NULL),(422,'FORTY','FEMALE',0x00,'SEOUL','NONE','PCSB',65,NULL),(423,'TWENTY','MALE',0x00,'SEOUL','OTHER','PCSB',65,NULL),(424,'THIRTY','MALE',0x00,'SEOUL','CATHOLIC','PCSB',65,NULL),(425,'FORTY','MALE',0x00,'SEOUL','CHRISTIAN','PCSB',65,NULL),(426,'THIRTY','FEMALE',0x00,'SEOUL','NONE','PCSB',65,NULL),(427,'TEN','MALE',0x00,'SEOUL','CATHOLIC','PCSB',65,NULL),(428,'TWENTY','FEMALE',0x00,'DAEJEON','BUDDHISM','PCSB',65,NULL),(429,'FIFTY','FEMALE',0x00,'DAEJEON','OTHER','INSB',65,NULL),(430,'FORTY','FEMALE',0x00,'DAEJEON','NONE','INSB',65,NULL),(431,'FORTY','FEMALE',0x00,'DAEJEON','CHRISTIAN','INSB',65,NULL),(432,'THIRTY','MALE',0x00,'GYEONGNAM','CHRISTIAN','INSB',65,NULL),(433,'TEN','FEMALE',0x00,'GYEONGNAM','CHRISTIAN','INSB',65,NULL),(434,'FIFTY','MALE',0x00,'GYEONGNAM','CHRISTIAN','ICTR',65,NULL),(435,'THIRTY','MALE',0x00,'GYEONGNAM','NONE','ICTR',65,NULL),(436,'FORTY','MALE',0x00,'GYEONGNAM','BUDDHISM','ICTR',65,NULL),(437,'TWENTY','FEMALE',0x00,'GYEONGNAM','CATHOLIC','INSB',65,NULL),(438,'FIFTY','MALE',0x00,'GYEONGNAM','CHRISTIAN','ICTB',65,NULL),(439,'FIFTY','MALE',0x00,'GYEONGGI','CHRISTIAN','INTB',65,NULL),(440,'FORTY','FEMALE',0x00,'GYEONGGI','CATHOLIC','PCTR',65,NULL),(441,'FIFTY','FEMALE',0x00,'JEONNAM','BUDDHISM','PCSR',65,NULL),(443,'FORTY','FEMALE',0x01,'GYEONGGI','OTHER','ICTB',67,NULL),(444,'TEN','MALE',0x01,'GYEONGGI','CHRISTIAN','INSB',67,NULL),(445,'TWENTY','MALE',0x01,'GYEONGGI','CHRISTIAN','COMMON',67,NULL),(446,'FORTY','FEMALE',0x01,'GYEONGGI','OTHER','ICTB',67,NULL),(447,'TEN','MALE',0x01,'GYEONGGI','CHRISTIAN','INSB',67,NULL),(448,'TWENTY','MALE',0x01,'GYEONGGI','CHRISTIAN','COMMON',67,NULL),(449,'TEN','FEMALE',0x01,'GYEONGGI','CATHOLIC','INSR',67,NULL),(450,'THIRTY','MALE',0x01,'GYEONGGI','BUDDHISM','INTR',67,NULL),(451,'FIFTY','FEMALE',0x01,'GYEONGGI','OTHER','INSR',67,NULL),(452,'TEN','FEMALE',0x01,'GYEONGGI','CHRISTIAN','ICSB',67,NULL),(453,'FORTY','FEMALE',0x01,'GYEONGGI','CATHOLIC','PNSR',67,NULL),(454,'TEN','FEMALE',0x01,'GYEONGGI','NONE','ICTB',67,NULL),(455,'TEN','MALE',0x01,'GYEONGGI','BUDDHISM','ICSB',67,NULL),(456,'FIFTY','FEMALE',0x01,'GYEONGGI','BUDDHISM','PNTB',67,NULL),(457,'TWENTY','FEMALE',0x01,'GYEONGGI','NONE','PCTR',67,NULL),(458,'FIFTY','FEMALE',0x01,'GYEONGGI','CHRISTIAN','ICSR',67,NULL),(459,'FIFTY','FEMALE',0x01,'GYEONGGI','CATHOLIC','INTR',67,NULL),(460,'TEN','FEMALE',0x01,'GYEONGGI','CATHOLIC','PCTR',67,NULL),(461,'TWENTY','FEMALE',0x01,'GYEONGGI','CHRISTIAN','COMMON',67,NULL),(462,'THIRTY','MALE',0x01,'GYEONGGI','NONE','PNSB',67,NULL),(463,'TWENTY','MALE',0x01,'GYEONGGI','OTHER','PCSB',67,NULL),(464,'THIRTY','FEMALE',0x01,'GANGWON','BUDDHISM','ICTR',67,NULL),(465,'FIFTY','FEMALE',0x01,'JEONBUK','CHRISTIAN','PCSB',67,NULL),(466,'TWENTY','FEMALE',0x01,'BUSAN','OTHER','PNTR',67,NULL),(467,'THIRTY','MALE',0x01,'GYEONGNAM','BUDDHISM','PCTR',67,NULL),(468,'FIFTY','FEMALE',0x01,'DAEJEON','OTHER','PCSR',67,NULL),(469,'FORTY','MALE',0x01,'GYEONGBUK','CHRISTIAN','ICSR',67,NULL),(470,'THIRTY','FEMALE',0x01,'GWANGJU','NONE','INTB',67,NULL),(471,'TWENTY','MALE',0x01,'SEOUL','CATHOLIC','ICSB',67,NULL),(472,'TEN','MALE',0x01,'CHUNGNAM','CHRISTIAN','ICTR',67,NULL),(473,'TEN','MALE',0x01,'GWANGJU','OTHER','ICTR',67,NULL),(474,'TEN','MALE',0x01,'ULSAN','CATHOLIC','INTB',67,NULL),(475,'TWENTY','MALE',0x01,'BUSAN','CHRISTIAN','INTB',67,NULL),(476,'FORTY','FEMALE',0x01,'JEJU','BUDDHISM','PNTR',67,NULL),(477,'TWENTY','FEMALE',0x01,'DAEGU','BUDDHISM','PNTR',67,NULL),(478,'FORTY','FEMALE',0x01,'DAEGU','BUDDHISM','ICSB',67,NULL),(479,'TWENTY','FEMALE',0x01,'GYEONGNAM','NONE','PNSR',67,NULL),(480,'THIRTY','FEMALE',0x01,'JEONBUK','CATHOLIC','INTB',67,NULL),(481,'FORTY','FEMALE',0x01,'SEJONG','CHRISTIAN','INSB',67,NULL),(482,'TEN','FEMALE',0x01,'GWANGJU','BUDDHISM','COMMON',67,NULL),(483,'THIRTY','MALE',0x01,'SEJONG','OTHER','ICSB',67,NULL),(484,'FIFTY','MALE',0x01,'JEONBUK','BUDDHISM','PNSB',67,NULL),(485,'FIFTY','MALE',0x01,'SEJONG','OTHER','ICSR',67,NULL),(486,'TEN','FEMALE',0x01,'DAEGU','CATHOLIC','PNSB',67,NULL),(487,'FIFTY','FEMALE',0x01,'GYEONGNAM','CHRISTIAN','PNTB',67,NULL),(488,'FIFTY','MALE',0x01,'BUSAN','NONE','PNTR',67,NULL),(489,'FORTY','MALE',0x01,'INCHEON','BUDDHISM','ICTB',67,NULL),(490,'TWENTY','MALE',0x01,'JEONNAM','OTHER','ICSB',67,NULL),(491,'TEN','FEMALE',0x01,'GYEONGGI','BUDDHISM','COMMON',65,NULL),(492,'TEN','FEMALE',0x01,'SEOUL','OTHER','PNSR',65,NULL),(493,'TEN','FEMALE',0x01,'DAEGU','BUDDHISM','INSB',65,NULL),(494,'FORTY','MALE',0x01,'ULSAN','CATHOLIC','COMMON',65,NULL),(495,'THIRTY','FEMALE',0x01,'GWANGJU','NONE','PNTB',65,NULL),(496,'FIFTY','FEMALE',0x01,'SEOUL','NONE','PCTB',65,NULL),(497,'FIFTY','MALE',0x01,'CHUNGNAM','BUDDHISM','PNTB',65,NULL),(498,'TWENTY','MALE',0x01,'GYEONGNAM','BUDDHISM','PCTB',65,NULL),(499,'FIFTY','FEMALE',0x01,'GYEONGBUK','CATHOLIC','INSR',65,NULL),(500,'TWENTY','FEMALE',0x01,'DAEJEON','OTHER','ICSB',65,NULL),(501,'THIRTY','MALE',0x01,'CHUNGNAM','CHRISTIAN','INTR',65,NULL),(502,'TEN','FEMALE',0x01,'DAEGU','CATHOLIC','ICTR',65,NULL),(503,'FORTY','FEMALE',0x01,'CHUNGBUK','CHRISTIAN','PNSR',65,NULL),(504,'FIFTY','FEMALE',0x01,'GYEONGNAM','CATHOLIC','PNSR',65,NULL),(505,'FIFTY','FEMALE',0x01,'GANGWON','CATHOLIC','ICTB',65,NULL),(506,'TEN','FEMALE',0x01,'SEJONG','CHRISTIAN','PCTR',65,NULL),(507,'TEN','MALE',0x01,'SEOUL','CATHOLIC','ICTB',65,NULL),(508,'THIRTY','MALE',0x01,'GYEONGBUK','CHRISTIAN','PCSB',65,NULL),(509,'FORTY','FEMALE',0x01,'JEONBUK','NONE','INSB',65,NULL),(510,'TWENTY','FEMALE',0x01,'GANGWON','BUDDHISM','PNSR',65,NULL),(511,'TEN','FEMALE',0x01,'GYEONGNAM','BUDDHISM','INTB',65,NULL),(512,'THIRTY','MALE',0x01,'BUSAN','OTHER','ICSB',65,NULL),(513,'TWENTY','FEMALE',0x01,'GANGWON','BUDDHISM','ICSB',65,NULL),(514,'FORTY','MALE',0x01,'GYEONGGI','CHRISTIAN','PNTR',65,NULL),(515,'FIFTY','FEMALE',0x01,'GYEONGNAM','CATHOLIC','ICTR',65,NULL),(516,'FIFTY','MALE',0x01,'CHUNGNAM','CATHOLIC','PNTB',65,NULL),(517,'FIFTY','FEMALE',0x01,'BUSAN','NONE','PNSB',65,NULL),(518,'TEN','FEMALE',0x01,'JEJU','NONE','ICTB',65,NULL),(519,'FORTY','FEMALE',0x01,'GYEONGBUK','CHRISTIAN','PCSR',65,NULL),(520,'TWENTY','MALE',0x01,'SEJONG','BUDDHISM','INSB',65,NULL),(521,'THIRTY','MALE',0x01,'JEONNAM','NONE','PNTR',65,NULL),(522,'TEN','MALE',0x01,'CHUNGNAM','NONE','INTR',65,NULL),(523,'THIRTY','MALE',0x01,'JEONNAM','CHRISTIAN','PNTB',65,NULL),(524,'TWENTY','FEMALE',0x01,'JEJU','CATHOLIC','INSR',65,NULL),(525,'FIFTY','FEMALE',0x01,'GANGWON','BUDDHISM','INTR',65,NULL),(526,'TWENTY','MALE',0x01,'SEOUL','NONE','ICTR',65,3),(527,'TWENTY','MALE',0x01,'SEOUL','NONE','ICTR',64,3),(532,'FIFTY','MALE',0x01,'SEOUL','NONE','INSB',67,2),(533,'FIFTY','MALE',0x01,'SEOUL','NONE','INSB',65,2),(537,'TWENTY','MALE',0x00,'SEOUL','BUDDHISM','INSR',70,34),(538,'THIRTY','MALE',0x01,'SEOUL','BUDDHISM','PCTR',65,26),(539,'TWENTY','FEMALE',0x01,'JEJU','BUDDHISM','INSR',65,35),(540,'TWENTY','FEMALE',0x00,'JEJU','BUDDHISM','INSR',70,35),(541,'TWENTY','MALE',0x00,'SEOUL','NONE','PCSR',70,39),(542,'TWENTY','MALE',0x01,'SEOUL','NONE','PCSR',67,39),(545,'TWENTY','MALE',0x00,'SEOUL','NONE','PNSR',65,39),(547,'FIFTY','MALE',0x00,'SEOUL','NONE','INSB',70,2);
/*!40000 ALTER TABLE `vote` ENABLE KEYS */;

--
-- Dumping routines for database 'square_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-11 15:38:15
