CREATE TABLE `user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

 CREATE TABLE `celestial_body` (
  `celestial_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `celestial_name` varchar(30) NOT NULL,
  `system_id` bigint(20) unsigned NOT NULL,
  `gp` int(2) unsigned NOT NULL,
  `du_entity_iy` int(10) unsigned NOT NULL,
  PRIMARY KEY (`celestial_id`)
);

CREATE TABLE `owner` (
  `owner_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `owner_name` varchar(200) NOT NULL,
  PRIMARY KEY (`owner_id`)
);

CREATE TABLE `tile_owner` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `celestial_id` bigint(20) unsigned NOT NULL,
  `tile_id` bigint(20) unsigned NOT NULL,
  `owner_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `celestial_id` (`celestial_id`,`tile_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `tile_owner_ibfk_1` FOREIGN KEY (`celestial_id`) REFERENCES `celestial_body` (`celestial_id`),
  CONSTRAINT `tile_owner_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`owner_id`)
);

CREATE TABLE `gp_vertex` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vertex_id` bigint(20) unsigned NOT NULL,
  `gp_size` bigint(20) unsigned NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `z` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vertex_id` (`vertex_id`,`gp_size`) USING BTREE,
  KEY `celestial_id` (`gp_size`)
);

 CREATE TABLE `gp_face` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tile_id` bigint(20) unsigned NOT NULL,
  `gp_size` bigint(20) unsigned NOT NULL,
  `v1` bigint(20) unsigned NOT NULL,
  `v2` bigint(20) unsigned NOT NULL,
  `v3` bigint(20) unsigned NOT NULL,
  `v4` bigint(20) unsigned NOT NULL,
  `v5` bigint(20) unsigned NOT NULL,
  `v6` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tile_id` (`tile_id`,`gp_size`),
  KEY `face_v1` (`v1`,`gp_size`),
  KEY `face_v2` (`v2`,`gp_size`),
  KEY `face_v3` (`v3`,`gp_size`),
  KEY `face_v4` (`v4`,`gp_size`),
  KEY `face_v5` (`v5`,`gp_size`),
  KEY `face_v6` (`v6`,`gp_size`),
  CONSTRAINT `face_v1` FOREIGN KEY (`v1`, `gp_size`) REFERENCES `gp_vertex` (`vertex_id`, `gp_size`),
  CONSTRAINT `face_v2` FOREIGN KEY (`v2`, `gp_size`) REFERENCES `gp_vertex` (`vertex_id`, `gp_size`),
  CONSTRAINT `face_v3` FOREIGN KEY (`v3`, `gp_size`) REFERENCES `gp_vertex` (`vertex_id`, `gp_size`),
  CONSTRAINT `face_v4` FOREIGN KEY (`v4`, `gp_size`) REFERENCES `gp_vertex` (`vertex_id`, `gp_size`),
  CONSTRAINT `face_v5` FOREIGN KEY (`v5`, `gp_size`) REFERENCES `gp_vertex` (`vertex_id`, `gp_size`),
  CONSTRAINT `face_v6` FOREIGN KEY (`v6`, `gp_size`) REFERENCES `gp_vertex` (`vertex_id`, `gp_size`)
);

CREATE TABLE `scan` (
  `scan_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `celestial_id` bigint(20) unsigned NOT NULL,
  `tile_id` bigint(20) unsigned NOT NULL,
  `owner_id` bigint(20) unsigned NOT NULL,
  `timestamp` datetime NOT NULL,
  `bauxite` bigint(20) unsigned DEFAULT NULL,
  `coal` bigint(20) unsigned DEFAULT NULL,
  `hematite` bigint(20) unsigned DEFAULT NULL,
  `quartz` bigint(20) unsigned DEFAULT NULL,
  `chromite` bigint(20) unsigned DEFAULT NULL,
  `limestone` bigint(20) unsigned DEFAULT NULL,
  `malachite` bigint(20) unsigned DEFAULT NULL,
  `natron` bigint(20) unsigned DEFAULT NULL,
  `acanthite` bigint(20) unsigned DEFAULT NULL,
  `garnierite` bigint(20) unsigned DEFAULT NULL,
  `petalite` bigint(20) unsigned DEFAULT NULL,
  `pyrite` bigint(20) unsigned DEFAULT NULL,
  `cobaltite` bigint(20) unsigned DEFAULT NULL,
  `cryolite` bigint(20) unsigned DEFAULT NULL,
  `gold_nuggets` bigint(20) unsigned DEFAULT NULL,
  `kolbeckite` bigint(20) unsigned DEFAULT NULL,
  `columbite` bigint(20) unsigned DEFAULT NULL,
  `illmenite` bigint(20) unsigned DEFAULT NULL,
  `rhodonite` bigint(20) unsigned DEFAULT NULL,
  `thoramine` bigint(20) unsigned DEFAULT NULL,
  `vanadinite` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`scan_id`),
  KEY `celestial_id` (`celestial_id`),
  KEY `owner_id` (`owner_id`),
  KEY `scan_id` (`scan_id`,`celestial_id`,`tile_id`),
  CONSTRAINT `scan_ibfk_1` FOREIGN KEY (`celestial_id`) REFERENCES `celestial_body` (`celestial_id`),
  CONSTRAINT `scan_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`)
);
