-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(191) NOT NULL,
    `refresh_tkn` TEXT NULL,
    `last_prvdr_nm` VARCHAR(50) NULL,
    `last_login_dt` DATETIME(0) NULL,
    `creat_dt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updt_dt` DATETIME(0) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_soc` (
    `prvdr_nm` VARCHAR(50) NOT NULL,
    `prvdr_user_id` VARCHAR(100) NOT NULL,
    `user_id` VARCHAR(100) NOT NULL,
    `soc_id` VARCHAR(100) NULL,
    `access_tkn` TEXT NULL,
    `refresh_tkn` TEXT NULL,
    `id_tkn` TEXT NULL,
    `tkn_expr_dt` DATETIME(0) NULL,
    `scope` VARCHAR(100) NULL,
    `creat_dt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updt_dt` DATETIME(0) NULL,

    PRIMARY KEY (`prvdr_nm`, `prvdr_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wedd` (
    `wedd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `wedd_ttl` VARCHAR(50) NULL,
    `wedd_slug` VARCHAR(100) NULL,
    `creat_dt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updt_dt` DATETIME(0) NULL,

    PRIMARY KEY (`wedd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wedd_dtl` (
    `wedd_id` INTEGER NOT NULL,
    `main_poster_styl` VARCHAR(50) NULL,
    `shr_ttl` VARCHAR(50) NULL,
    `info_grm_last_nm` VARCHAR(50) NULL,
    `info_grm_first_nm` VARCHAR(50) NULL,
    `info_brd_last_nm` VARCHAR(50) NULL,
    `info_brd_first_nm` VARCHAR(50) NULL,
    `info_nm_ordr_se` VARCHAR(1) NULL,
    `info_wedd_de` VARCHAR(8) NULL,
    `info_wedd_tm_pd` VARCHAR(10) NULL,
    `info_wedd_tm` VARCHAR(4) NULL,
    `info_hall_nm` VARCHAR(50) NULL,
    `info_hall_flr` VARCHAR(50) NULL,
    `prnt_grm_fthr_nm` VARCHAR(50) NULL,
    `prnt_grm_fthr_deceased_yn` BOOLEAN NULL,
    `prnt_grm_mthr_nm` VARCHAR(50) NULL,
    `prnt_grm_mthr_deceased_yn` BOOLEAN NULL,
    `prnt_grm_rank_nm` VARCHAR(50) NULL,
    `prnt_brd_fthr_nm` VARCHAR(50) NULL,
    `prnt_brd_fthr_deceased_yn` BOOLEAN NULL,
    `prnt_brd_mthr_nm` VARCHAR(50) NULL,
    `prnt_brd_mthr_deceased_yn` BOOLEAN NULL,
    `prnt_brd_rank_nm` VARCHAR(50) NULL,
    `inv_ttl` VARCHAR(50) NULL,
    `inv_msg` TEXT NULL,
    `intr_ttl` VARCHAR(50) NULL,
    `intr_grm_msg` TEXT NULL,
    `intr_brd_msg` TEXT NULL,
    `prnt_intr_ttl` VARCHAR(50) NULL,
    `prnt_intr_msg` TEXT NULL,
    `acnt_ttl` VARCHAR(50) NULL,
    `acnt_msg` TEXT NULL,
    `acnt_grm_bnk_nm` VARCHAR(10) NULL,
    `acnt_grm_no` VARCHAR(20) NULL,
    `acnt_grm_hldr_nm` VARCHAR(50) NULL,
    `acnt_grm_fthr_bnk_nm` VARCHAR(10) NULL,
    `acnt_grm_fthr_no` VARCHAR(20) NULL,
    `acnt_grm_fthr_hldr_nm` VARCHAR(50) NULL,
    `acnt_grm_mthr_bnk_nm` VARCHAR(10) NULL,
    `acnt_grm_mthr_no` VARCHAR(20) NULL,
    `acnt_grm_mthr_hldr_nm` VARCHAR(50) NULL,
    `acnt_brd_bnk_nm` VARCHAR(10) NULL,
    `acnt_brd_no` VARCHAR(20) NULL,
    `acnt_brd_hldr_nm` VARCHAR(50) NULL,
    `acnt_brd_fthr_bnk_nm` VARCHAR(10) NULL,
    `acnt_brd_fthr_no` VARCHAR(20) NULL,
    `acnt_brd_fthr_hldr_nm` VARCHAR(50) NULL,
    `acnt_brd_mthr_bnk_nm` VARCHAR(10) NULL,
    `acnt_brd_mthr_no` VARCHAR(20) NULL,
    `acnt_brd_mthr_hldr_nm` VARCHAR(50) NULL,
    `loc_addr` VARCHAR(100) NULL,
    `loc_addr_dtl` VARCHAR(100) NULL,
    `loc_guide_msg` TEXT NULL,
    `loc_trans_1_ttl` VARCHAR(50) NULL,
    `loc_trans_1_msg` TEXT NULL,
    `loc_trans_2_ttl` VARCHAR(50) NULL,
    `loc_trans_2_msg` TEXT NULL,
    `loc_trans_3_ttl` VARCHAR(50) NULL,
    `loc_trans_3_msg` TEXT NULL,
    `theme_font_nm` VARCHAR(50) NULL,
    `theme_font_size` INTEGER NULL,
    `theme_bg_color` VARCHAR(20) NULL,
    `theme_accent_color` VARCHAR(20) NULL,
    `theme_zoom_prevent_yn` BOOLEAN NULL,
    `load_styl` VARCHAR(50) NULL,
    `glly_ttl` VARCHAR(50) NULL,
    `creat_dt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updt_dt` DATETIME(0) NULL,

    PRIMARY KEY (`wedd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wedd_media` (
    `wedd_id` INTEGER NOT NULL,
    `media_id` INTEGER NOT NULL,
    `img_type` VARCHAR(50) NULL,
    `display_ordr` INTEGER NULL,
    `org_url` VARCHAR(255) NULL,
    `edit_url` VARCHAR(255) NULL,
    `file_extsn` VARCHAR(10) NULL,
    `file_size` INTEGER NULL,
    `creat_dt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updt_dt` DATETIME(0) NULL,

    PRIMARY KEY (`wedd_id`, `media_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wedd_sect_set` (
    `wedd_id` INTEGER NOT NULL,
    `sect_key` VARCHAR(50) NOT NULL,
    `display_yn` BOOLEAN NULL,
    `display_ordr` INTEGER NULL,
    `creat_dt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updt_dt` DATETIME(0) NULL,

    PRIMARY KEY (`wedd_id`, `sect_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_soc` ADD CONSTRAINT `user_soc_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wedd` ADD CONSTRAINT `wedd_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wedd_dtl` ADD CONSTRAINT `wedd_dtl_wedd_id_fkey` FOREIGN KEY (`wedd_id`) REFERENCES `wedd`(`wedd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wedd_media` ADD CONSTRAINT `wedd_media_wedd_id_fkey` FOREIGN KEY (`wedd_id`) REFERENCES `wedd_dtl`(`wedd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wedd_sect_set` ADD CONSTRAINT `wedd_sect_set_wedd_id_fkey` FOREIGN KEY (`wedd_id`) REFERENCES `wedd`(`wedd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
