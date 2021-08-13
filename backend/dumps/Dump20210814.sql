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
-- Table structure for table `EmployeeDepartments`
--

DROP TABLE IF EXISTS `EmployeeDepartments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EmployeeDepartments` (
  `EmployeeDepartmentID` int NOT NULL AUTO_INCREMENT,
  `DepartmentName` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`EmployeeDepartmentID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmployeeDepartments`
--

LOCK TABLES `EmployeeDepartments` WRITE;
/*!40000 ALTER TABLE `EmployeeDepartments` DISABLE KEYS */;
INSERT INTO `EmployeeDepartments` VALUES (1,'IT Department'),(3,'Senior High School Faculty Department');
/*!40000 ALTER TABLE `EmployeeDepartments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmployeePositions`
--

DROP TABLE IF EXISTS `EmployeePositions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EmployeePositions` (
  `EmployeePositionID` int NOT NULL AUTO_INCREMENT,
  `PositionName` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`EmployeePositionID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmployeePositions`
--

LOCK TABLES `EmployeePositions` WRITE;
/*!40000 ALTER TABLE `EmployeePositions` DISABLE KEYS */;
INSERT INTO `EmployeePositions` VALUES (1,'Programmer'),(2,'Teacher');
/*!40000 ALTER TABLE `EmployeePositions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmployeeSalaries`
--

DROP TABLE IF EXISTS `EmployeeSalaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EmployeeSalaries` (
  `EmployeeSalaryID` int NOT NULL AUTO_INCREMENT,
  `Salary` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `StartedDate` date NOT NULL,
  `UntilDate` date DEFAULT NULL,
  `EmployeeID` int NOT NULL,
  PRIMARY KEY (`EmployeeSalaryID`),
  KEY `fk_EmployeeSalaries_1_idx` (`EmployeeID`),
  CONSTRAINT `1` FOREIGN KEY (`EmployeeID`) REFERENCES `Employees` (`EmployeeID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmployeeSalaries`
--

LOCK TABLES `EmployeeSalaries` WRITE;
/*!40000 ALTER TABLE `EmployeeSalaries` DISABLE KEYS */;
INSERT INTO `EmployeeSalaries` VALUES (1,'50000','2021-08-08',NULL,2),(2,'4444','2021-08-08',NULL,1),(6,'10000','2021-08-12',NULL,1),(7,'999999999996','2021-08-13',NULL,1);
/*!40000 ALTER TABLE `EmployeeSalaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employees`
--

DROP TABLE IF EXISTS `Employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Employees` (
  `EmployeeID` int NOT NULL AUTO_INCREMENT,
  `EmployeeNo` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `FirstName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `MiddleName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `LastName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `Sex` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ContactNo` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `HireDate` date NOT NULL,
  `BirthDate` date NOT NULL,
  `EmployeeDepartmentID` int NOT NULL,
  `EmployeePositionID` int NOT NULL,
  PRIMARY KEY (`EmployeeID`),
  KEY `fk_Employees_1_idx` (`EmployeePositionID`),
  KEY `fk_Employees_2_idx` (`EmployeeDepartmentID`),
  CONSTRAINT `fk_Employees_1` FOREIGN KEY (`EmployeePositionID`) REFERENCES `EmployeePositions` (`EmployeePositionID`) ON DELETE CASCADE,
  CONSTRAINT `fk_Employees_2` FOREIGN KEY (`EmployeeDepartmentID`) REFERENCES `EmployeeDepartments` (`EmployeeDepartmentID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employees`
--

LOCK TABLES `Employees` WRITE;
/*!40000 ALTER TABLE `Employees` DISABLE KEYS */;
INSERT INTO `Employees` VALUES (1,'EMP-1','Dorco','Sam','Magallanes','F','098492495012','2000-05-30','1998-04-23',1,1),(2,'EMP-00002','Freddy','Marquez','Maroon','M','09894930921','2021-08-01','2021-08-31',1,1);
/*!40000 ALTER TABLE `Employees` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Menus`
--

LOCK TABLES `Menus` WRITE;
/*!40000 ALTER TABLE `Menus` DISABLE KEYS */;
INSERT INTO `Menus` VALUES (1,'Users',2,1),(2,'Roles',2,5),(5,'Home',NULL,2),(6,'ParentMenus',3,6),(7,'Menus',3,7),(9,'Pages',3,8),(15,'Subpages',3,10),(53,'Salary',23,37),(54,'Routes',3,38),(55,'Employee',23,39),(58,'Department',23,40),(59,'Positions',23,41);
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
) ENGINE=InnoDB AUTO_INCREMENT=384 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageRoles`
--

LOCK TABLES `PageRoles` WRITE;
/*!40000 ALTER TABLE `PageRoles` DISABLE KEYS */;
INSERT INTO `PageRoles` VALUES (1,1,1,1),(2,2,1,1),(3,2,2,1),(4,1,2,1),(5,1,3,2),(6,2,3,2),(7,5,1,3),(35,5,2,3),(38,5,3,2),(59,6,1,3),(60,7,1,3),(88,6,3,2),(89,7,3,2),(95,8,1,3),(190,10,1,3),(309,37,1,1),(311,38,1,3),(316,39,1,1),(317,40,1,1),(318,41,1,1),(324,1,19,1),(325,2,19,1),(326,5,19,1),(327,6,19,1),(328,7,19,1),(329,8,19,1),(330,10,19,1),(331,37,19,1),(332,38,19,1),(333,39,19,1),(334,40,19,1),(335,41,19,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pages`
--

LOCK TABLES `Pages` WRITE;
/*!40000 ALTER TABLE `Pages` DISABLE KEYS */;
INSERT INTO `Pages` VALUES (1,'Users','/users'),(2,'Home','/home'),(5,'Roles','/roles'),(6,'ParentMenus','/parentmenus'),(7,'Menus','/menus'),(8,'Pages','/pages'),(10,'SubPages','/subpages'),(37,'EmployeeSalaries','/employee/salaries'),(38,'Routes','/routes'),(39,'Employees','/employees'),(40,'EmployeeDepartments','/employee/departments'),(41,'EmployeePositions','/employee/positions');
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ParentMenus`
--

LOCK TABLES `ParentMenus` WRITE;
/*!40000 ALTER TABLE `ParentMenus` DISABLE KEYS */;
INSERT INTO `ParentMenus` VALUES (2,'Users And Roles',2),(3,'App\'s Components and Menus',1),(23,'Employees',23);
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'superadmin'),(2,'admin'),(3,'guest'),(19,'Programmer');
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
) ENGINE=InnoDB AUTO_INCREMENT=267 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RouteRoles`
--

LOCK TABLES `RouteRoles` WRITE;
/*!40000 ALTER TABLE `RouteRoles` DISABLE KEYS */;
INSERT INTO `RouteRoles` VALUES (1,1,1,1),(2,1,2,2),(3,1,3,2),(7,3,1,2),(17,3,2,2),(18,4,1,2),(23,4,2,2),(88,2,1,2),(89,5,1,2),(114,2,2,3),(115,5,2,3),(125,6,1,2),(148,7,1,2),(197,2,3,2),(198,3,3,2),(199,4,3,2),(200,5,3,2),(201,6,3,2),(202,7,3,2),(205,8,1,2),(215,9,1,2),(216,10,1,1),(217,1,19,1),(218,2,19,1),(219,3,19,1),(220,4,19,1),(221,5,19,1),(222,6,19,1),(223,7,19,1),(224,8,19,1),(225,9,19,1),(226,10,19,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Routes`
--

LOCK TABLES `Routes` WRITE;
/*!40000 ALTER TABLE `Routes` DISABLE KEYS */;
INSERT INTO `Routes` VALUES (1,'Users','/API/user'),(2,'Roles','/API/role'),(3,'SubPages','/API/subpage'),(4,'Menus','/API/menus'),(5,'PageRoles','/API/pagerole'),(6,'RouteRoles','/API/routerole'),(7,'Privileges','/API/privilege'),(8,'Pages','/API/page'),(9,'Routes','/API/route'),(10,'Employee','/API/employee');
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubPages`
--

LOCK TABLES `SubPages` WRITE;
/*!40000 ALTER TABLE `SubPages` DISABLE KEYS */;
INSERT INTO `SubPages` VALUES (1,'UsersForm','/users/form/:id',1),(2,'RolesForm','/roles/form/:id',5),(3,'RouteRolesForm','/routeroles/form/:id',5),(4,'PageRolesForm','/pageroles/form/:id',5),(5,'ParentMenusForm','/parentmenus/form/:id',6),(6,'MenusForm','/menus/form/:id',7),(7,'PagesForm','/pages/form/:id',8),(8,'SubPagesForm','/subpages/form/:id',10),(10,'PagesFormBulk','/pages/bulk/form/:id',8),(14,'EmployeeSalariesForm','/employee/salaries/form/:id',37),(15,'RoutesForm','/routes/form/:id',38),(16,'EmployeesForm','/employees/form/:id',39),(17,'EmployeeDepartmentsForm','/employee/departments/form/:id',40),(18,'EmployeePositionsForm','/employee/positions/form/:id',41);
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
  CONSTRAINT `Users_fk1` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`RoleID`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'dorco','$2b$10$Ib1v1yc4aLpdflqybEuf1Op095m7kGhNwAe2aTlcg2iOg5jSuPC.S',19,'1624271794212-kim jong.jpg'),(2,'admin','$2b$10$.2OW/EjTBFTW0OxksBiAOux6ezZdIvhtkgazNEVzfXcyJUhBucCf2',1,NULL),(6,'mayong','$2b$10$t9jeAKRvNc3qxisBQh09weI7QJxNo38xjPPE5ecvl6WnU13L2yp3y',3,'1624528567768-Screenshot from 2021-05-14 16-36-00.png'),(8,'oiuteqwotaogj','$2b$10$dZpsLK1gxrVuRrkdo7qz0u6vqJcNA85C1zLihOpaknWt6vjLZ370y',3,NULL),(9,'qwpqwtqwutp','$2b$10$.nD6hpwd8iM2Ya7yag/Qn.9S.MNcGPmOFH/ebZNkG9igb8HjCcvIO',1,NULL),(10,'421480','$2b$10$eDNQSokQsO9Mgme6cDFxou3ynDM8/hT16Z5E15BRv6Jsub/yq8S.G',3,NULL),(11,'21412904871208','$2b$10$kx/ZKRVG9GINvtZyzisaoeVDmfb8IlN1b7xB2/Sy4.oS61i1t3tcO',3,NULL),(12,'5125-1295j098','$2b$10$w8H2grEC56NwhqIR6q.ojeo6wzsCZ9oAZj2QV6xyOHSZV7yBvofMm',3,NULL),(13,'1212412rawtwq','$2b$10$ZQzaLX.GHZb9o7OvewTsDO7SpyzATnq7I3BE2Z.7oDxzfApQPQ6pW',3,NULL),(14,'wtqwqw51235','rqwrwqr',3,NULL),(15,'guest','$2b$10$wBahxQyRB0kFA/kw3ZxKYuur/9mjJ4ibPH0rnB2ng9Ay.cX3DUdvm',1,NULL),(16,'dogs','$2b$10$/WTtXxz1yLCVa95pYFmT9eFCRnylSmFoKJpGnBYPFcDZpYLIneIIC',1,NULL),(17,'test2','$2b$10$/9q61aJ33i5eQMCsqS6I5ur0iFDrAq/BLtsHYrGk5mUkS0zH0naeq',2,NULL),(18,'kittens','$2b$10$U8uhbbMifQaOUafeL9k.ROq/uKWZqkcHbE9rdgD5dfvimFQj/eXNm',1,NULL),(19,'bakin2','$2b$10$rin02PkFz0BeYuUX0Iao4esdo9N.o1h9XYszw9kkouzm1cQpVSd6a',3,NULL),(20,'darqwr','$2b$10$MVyqqhdqNQjhPxXrHnRzYOZA2yESkqLydggIX.a/L97azAC.hhveu',1,NULL),(21,'rwqrqwr','$2b$10$o31IHL656h7Nvl6f.lIw3eDU9.XjpliR7ulWVPlGpVogM/ZVO7EDW',1,NULL),(22,'test5rfrwerwer','$2b$10$A2rhBaImomBamNMrkoabWeaP6AWAyDm9p0IClVfkikakelLLApWS6',1,NULL),(23,'test4fgsdgdstwet','$2b$10$QMD60CD3544drVEiNygQEOnoshEA4hVJEbFKWmSCYrw0rOMC4kK/O',1,NULL),(24,'testlast','$2b$10$zPdoQyuau4iSmw0D9Iy2MuSr6bcVc7pZfl.Pu8b8jVFRnTp2fPxyy',1,'1623142664849-area.png'),(30,'29th8','$2b$10$BPg9invdDFrWWTKcjE02r.QYBSrG7Xevpsna3nhCcAsiNj0nwpOEy',3,'1623589703815-kim jong.jpg'),(37,'sarsarap5','$2b$10$mGlquLa96XXa0yppBav.Puw90YGp5.0Jy2Tf2ychdmOwNRJc919ke',3,'1628005014413-Screenshot from 2021-07-22 23-39-28.png');
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
INSERT INTO `sessions` VALUES ('57cb4926-dcee-413d-bf20-6bbf8a7d4bc0',1628957530,'{\"cookie\":{\"originalMaxAge\":86399995,\"expires\":\"2021-08-14T16:12:10.247Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userData\":{\"uname\":\"dorco\",\"userid\":1,\"uimage\":\"/uploads/1624271794212-kim jong.jpg\",\"roleid\":19}}');
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

-- Dump completed on 2021-08-14  0:13:15
