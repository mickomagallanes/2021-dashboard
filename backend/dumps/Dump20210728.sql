-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: bugtracker
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Menus`
--

DROP TABLE IF EXISTS `Menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Menus` (
  `MenuID` int NOT NULL AUTO_INCREMENT,
  `MenuName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `ParentMenuID` int DEFAULT NULL,
  `PageID` int DEFAULT NULL,
  PRIMARY KEY (`MenuID`),
  KEY `fk_Menu_1_idx` (`ParentMenuID`),
  KEY `fk_Menus_1_idx` (`PageID`),
  CONSTRAINT `fk_Menu2` FOREIGN KEY (`PageID`) REFERENCES `Pages` (`PageID`) ON DELETE CASCADE,
  CONSTRAINT `fk_Menu_1` FOREIGN KEY (`ParentMenuID`) REFERENCES `ParentMenus` (`ParentMenuID`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Menus`
--

LOCK TABLES `Menus` WRITE;
/*!40000 ALTER TABLE `Menus` DISABLE KEYS */;
INSERT INTO `Menus` VALUES (1,'Users',2,1),(2,'Roles',1,5),(5,'Home',NULL,2),(6,'ParentMenus',3,6),(7,'Menus',3,7),(9,'Pages',12,8),(15,'Subpages',12,10);
/*!40000 ALTER TABLE `Menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageRoles`
--

DROP TABLE IF EXISTS `PageRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PageRoles` (
  `PageRolesID` int NOT NULL AUTO_INCREMENT,
  `PageID` int NOT NULL,
  `RoleID` int NOT NULL,
  `PrivilegeID` int NOT NULL,
  PRIMARY KEY (`PageRolesID`),
  UNIQUE KEY `PageRoleUnique` (`PageID`,`RoleID`),
  KEY `fk_PageRoles_1_idx` (`PageID`),
  KEY `fk_PageRoles_2_idx` (`RoleID`),
  KEY `fk_PageRoles_3_idx` (`PrivilegeID`),
  CONSTRAINT `fk_PageRoles_1` FOREIGN KEY (`PageID`) REFERENCES `Pages` (`PageID`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_PageRoles_2` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`RoleID`) ON DELETE CASCADE,
  CONSTRAINT `fk_PageRoles_3` FOREIGN KEY (`PrivilegeID`) REFERENCES `Privileges` (`PrivilegeID`)
) ENGINE=InnoDB AUTO_INCREMENT=314 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageRoles`
--

LOCK TABLES `PageRoles` WRITE;
/*!40000 ALTER TABLE `PageRoles` DISABLE KEYS */;
INSERT INTO `PageRoles` VALUES (1,1,1,1),(2,2,1,1),(3,2,2,1),(4,1,2,1),(5,1,3,2),(6,2,3,2),(7,5,1,1),(17,1,4,1),(18,2,4,2),(19,5,4,3),(35,5,2,3),(38,5,3,2),(59,6,1,1),(60,7,1,1),(61,1,17,3),(62,2,17,3),(63,5,17,3),(64,6,17,3),(65,7,17,3),(88,6,3,2),(89,7,3,2),(95,8,1,1),(108,8,17,3),(190,10,1,1),(286,1,18,1),(287,2,18,2),(288,5,18,1),(289,6,18,1),(290,7,18,2),(291,8,18,3),(292,10,18,1);
/*!40000 ALTER TABLE `PageRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pages`
--

DROP TABLE IF EXISTS `Pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Pages` (
  `PageID` int NOT NULL AUTO_INCREMENT,
  `PageName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `PagePath` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`PageID`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pages`
--

LOCK TABLES `Pages` WRITE;
/*!40000 ALTER TABLE `Pages` DISABLE KEYS */;
INSERT INTO `Pages` VALUES (1,'Users','/users'),(2,'Home','/home'),(5,'Roles','/roles'),(6,'ParentMenus','/parentmenus'),(7,'Menus','/menus'),(8,'Pages','/pages'),(10,'SubPages','/subpages');
/*!40000 ALTER TABLE `Pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ParentMenus`
--

DROP TABLE IF EXISTS `ParentMenus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ParentMenus` (
  `ParentMenuID` int NOT NULL AUTO_INCREMENT,
  `ParentMenuName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `ParentMenuSort` int DEFAULT NULL,
  PRIMARY KEY (`ParentMenuID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ParentMenus`
--

LOCK TABLES `ParentMenus` WRITE;
/*!40000 ALTER TABLE `ParentMenus` DISABLE KEYS */;
INSERT INTO `ParentMenus` VALUES (1,'Roles & Relationships',3),(2,'Users',2),(3,'ParentMenu & Menu',1),(12,'Pages and Subpages',8),(14,'5qewftgtbbbbbbbbb',9);
/*!40000 ALTER TABLE `ParentMenus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Privileges`
--

DROP TABLE IF EXISTS `Privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Privileges` (
  `PrivilegeID` int NOT NULL AUTO_INCREMENT,
  `PrivilegeName` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`PrivilegeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Privileges`
--

LOCK TABLES `Privileges` WRITE;
/*!40000 ALTER TABLE `Privileges` DISABLE KEYS */;
INSERT INTO `Privileges` VALUES (1,'RW'),(2,'R'),(3,'None');
/*!40000 ALTER TABLE `Privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Roles` (
  `RoleID` int NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`RoleID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'superadmin'),(2,'admin'),(3,'guest'),(4,'test458'),(17,'45ewt'),(18,'newest');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RouteRoles`
--

DROP TABLE IF EXISTS `RouteRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RouteRoles` (
  `RouteRolesID` int NOT NULL AUTO_INCREMENT,
  `RouteID` int NOT NULL,
  `RoleID` int NOT NULL,
  `PrivilegeID` int NOT NULL,
  PRIMARY KEY (`RouteRolesID`),
  UNIQUE KEY `RouteRoleUnique` (`RouteID`,`RoleID`),
  KEY `fk_RouteRoles_1_idx` (`RoleID`),
  KEY `fk_RouteRoles_2_idx` (`RouteID`),
  KEY `fk_RouteRoles_3_idx` (`PrivilegeID`),
  CONSTRAINT `fk_RouteRoles_1` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`RoleID`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_RouteRoles_2` FOREIGN KEY (`RouteID`) REFERENCES `Routes` (`RouteID`),
  CONSTRAINT `fk_RouteRoles_3` FOREIGN KEY (`PrivilegeID`) REFERENCES `Privileges` (`PrivilegeID`)
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RouteRoles`
--

LOCK TABLES `RouteRoles` WRITE;
/*!40000 ALTER TABLE `RouteRoles` DISABLE KEYS */;
INSERT INTO `RouteRoles` VALUES (1,1,1,1),(2,1,2,2),(3,1,3,2),(7,3,1,1),(17,3,2,2),(18,4,1,1),(23,4,2,2),(88,2,1,1),(89,5,1,1),(114,2,2,3),(115,5,2,3),(120,1,4,1),(121,2,4,2),(122,3,4,3),(123,4,4,2),(124,5,4,1),(125,6,1,1),(147,6,4,3),(148,7,1,1),(183,1,17,3),(184,2,17,3),(185,3,17,3),(186,4,17,3),(187,5,17,3),(188,6,17,3),(189,7,17,3),(190,1,18,1),(191,2,18,1),(192,3,18,2),(193,4,18,1),(194,5,18,2),(195,6,18,1),(196,7,18,1),(197,2,3,2),(198,3,3,2),(199,4,3,2),(200,5,3,2),(201,6,3,2),(202,7,3,2),(205,8,1,1),(214,8,18,3);
/*!40000 ALTER TABLE `RouteRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Routes`
--

DROP TABLE IF EXISTS `Routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Routes` (
  `RouteID` int NOT NULL AUTO_INCREMENT,
  `RouteName` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `RoutePath` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`RouteID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Routes`
--

LOCK TABLES `Routes` WRITE;
/*!40000 ALTER TABLE `Routes` DISABLE KEYS */;
INSERT INTO `Routes` VALUES (1,'Users','/API/user'),(2,'Roles','/API/role'),(3,'SubPages','/API/subpage'),(4,'Menus','/API/menus'),(5,'PageRoles','/API/pagerole'),(6,'RouteRoles','/API/routerole'),(7,'Privileges','/API/privilege'),(8,'Pages','/API/page');
/*!40000 ALTER TABLE `Routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SubPages`
--

DROP TABLE IF EXISTS `SubPages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SubPages` (
  `SubPageID` int NOT NULL AUTO_INCREMENT,
  `SubPageName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `SubPagePath` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `PageID` int NOT NULL,
  PRIMARY KEY (`SubPageID`),
  KEY `fk_SubPages_1_idx` (`PageID`),
  CONSTRAINT `fk_SubPages_1` FOREIGN KEY (`PageID`) REFERENCES `Pages` (`PageID`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubPages`
--

LOCK TABLES `SubPages` WRITE;
/*!40000 ALTER TABLE `SubPages` DISABLE KEYS */;
INSERT INTO `SubPages` VALUES (1,'UsersForm','/users/form/:id',1),(2,'RolesForm','/roles/form/:id',5),(3,'RouteRolesForm','/routeroles/form/:id',5),(4,'PageRolesForm','/pageroles/form/:id',5),(5,'ParentMenusForm','/parentmenus/form/:id',6),(6,'MenusForm','/menus/form/:id',7),(7,'PagesForm','/pages/form/:id',8),(8,'SubPagesForm','/subpages/form/:id',10),(10,'PagesFormBulk','/pages/bulk/form/:id',8);
/*!40000 ALTER TABLE `SubPages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `RoleID` int NOT NULL,
  `Image` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`),
  KEY `Users_fk1_idx` (`RoleID`),
  CONSTRAINT `Users_fk1` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`RoleID`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'dorco','$2b$10$Ib1v1yc4aLpdflqybEuf1Op095m7kGhNwAe2aTlcg2iOg5jSuPC.S',1,'1624271794212-kim jong.jpg'),(2,'admin','$2b$10$.2OW/EjTBFTW0OxksBiAOux6ezZdIvhtkgazNEVzfXcyJUhBucCf2',1,NULL),(3,'test2636yo','$2b$10$aGfjgU8X.oftzSU8bCA12.u5mWaQy4V1NeGPV4bI90QFjBP8.w7Im',4,'1624508600243-tricy.png'),(6,'mayong','$2b$10$t9jeAKRvNc3qxisBQh09weI7QJxNo38xjPPE5ecvl6WnU13L2yp3y',3,'1624528567768-Screenshot from 2021-05-14 16-36-00.png'),(7,'joaquin','$2b$10$bU6iB6OTSr5l8iVAs1p4l.mXeaRM3/9R1xQ3Zs7QiEgKLzf3ena52',18,'1625060625561-sicp.png'),(8,'oiuteqwotaogj','$2b$10$dZpsLK1gxrVuRrkdo7qz0u6vqJcNA85C1zLihOpaknWt6vjLZ370y',3,NULL),(9,'qwpqwtqwutp','$2b$10$.nD6hpwd8iM2Ya7yag/Qn.9S.MNcGPmOFH/ebZNkG9igb8HjCcvIO',1,NULL),(10,'421480','$2b$10$eDNQSokQsO9Mgme6cDFxou3ynDM8/hT16Z5E15BRv6Jsub/yq8S.G',3,NULL),(11,'21412904871208','$2b$10$kx/ZKRVG9GINvtZyzisaoeVDmfb8IlN1b7xB2/Sy4.oS61i1t3tcO',3,NULL),(12,'5125-1295j098','$2b$10$w8H2grEC56NwhqIR6q.ojeo6wzsCZ9oAZj2QV6xyOHSZV7yBvofMm',3,NULL),(13,'1212412rawtwq','$2b$10$ZQzaLX.GHZb9o7OvewTsDO7SpyzATnq7I3BE2Z.7oDxzfApQPQ6pW',3,NULL),(14,'wtqwqw51235','rqwrwqr',3,NULL),(15,'guest','$2b$10$wBahxQyRB0kFA/kw3ZxKYuur/9mjJ4ibPH0rnB2ng9Ay.cX3DUdvm',1,NULL),(16,'dogs','$2b$10$/WTtXxz1yLCVa95pYFmT9eFCRnylSmFoKJpGnBYPFcDZpYLIneIIC',1,NULL),(17,'test2','$2b$10$/9q61aJ33i5eQMCsqS6I5ur0iFDrAq/BLtsHYrGk5mUkS0zH0naeq',2,NULL),(18,'kittens','$2b$10$U8uhbbMifQaOUafeL9k.ROq/uKWZqkcHbE9rdgD5dfvimFQj/eXNm',1,NULL),(19,'bakin2','$2b$10$rin02PkFz0BeYuUX0Iao4esdo9N.o1h9XYszw9kkouzm1cQpVSd6a',3,NULL),(20,'darqwr','$2b$10$MVyqqhdqNQjhPxXrHnRzYOZA2yESkqLydggIX.a/L97azAC.hhveu',1,NULL),(21,'rwqrqwr','$2b$10$o31IHL656h7Nvl6f.lIw3eDU9.XjpliR7ulWVPlGpVogM/ZVO7EDW',1,NULL),(22,'test5rfrwerwer','$2b$10$A2rhBaImomBamNMrkoabWeaP6AWAyDm9p0IClVfkikakelLLApWS6',1,NULL),(23,'test4fgsdgdstwet','$2b$10$QMD60CD3544drVEiNygQEOnoshEA4hVJEbFKWmSCYrw0rOMC4kK/O',1,NULL),(24,'testlast','$2b$10$zPdoQyuau4iSmw0D9Iy2MuSr6bcVc7pZfl.Pu8b8jVFRnTp2fPxyy',1,'1623142664849-area.png'),(25,'lastlast','$2b$10$.CsDVc7fWnEOIroR5/IkpuOgVKcpEuWDq7PDJCcJ03qk4KXutUkXW',3,NULL),(26,'t124124','$2b$10$9yhj3nPImcrzvdU83uCAqeVmDFIqMWQmY/LuHSbTXJJeQnxT8j6We',3,NULL),(27,'tetsot[3o5p32','$2b$10$pLPFneqEkDvp8JvoPcuVi.ZP7UaRzFfm8NIJMsLdqzmwSuKJ8BVx6',3,'1623145875395-g.png'),(28,'28th','$2b$10$yfBC2Grxz2b6.Nroxb68vOUtgqPmF53wNy.D.mdk.pqKH1bcBHoqG',3,NULL),(30,'29th','$2b$10$BPg9invdDFrWWTKcjE02r.QYBSrG7Xevpsna3nhCcAsiNj0nwpOEy',3,'1623589703815-kim jong.jpg'),(31,'3242345','$2b$10$QVEiWuhMBCLkl6SeC8wcMuRfhzeGuVlioPDq4e7tnRP5js1iXljZu',4,'1624612806667-sicp.png'),(32,'1234wrqwrwqrwerwer','$2b$10$IuPksyoNviaB3zCqhMCcLOeXPG27FasSYgcEm092Y/akVRvclyhmW',4,NULL),(33,'july 13 2021','$2b$10$bMvmBY.PmgONsTwQ3wi0ZuJHHh6oAiO3Lju87RvkF1V6fa2Im.V1G',17,NULL),(35,'july 13 2021 (2)','$2b$10$l.OCyXsmPCTIK.Ym8Vqcz.78mLX7NjnOrILLa.stCBkzQSDEgVoC6',4,'1626157055132-sicp.png');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('4b6dfdef-f7b4-4d9f-96a9-888c07acdf7b',1627568483,'{\"cookie\":{\"originalMaxAge\":86399988,\"expires\":\"2021-07-29T14:21:23.011Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userData\":{\"uname\":\"dorco\",\"userid\":1,\"uimage\":\"/uploads/1624271794212-kim jong.jpg\",\"roleid\":1}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-28 22:24:03
