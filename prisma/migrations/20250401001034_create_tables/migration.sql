-- CreateTable
CREATE TABLE `User` (
    `idDatabase` INTEGER NOT NULL AUTO_INCREMENT,
    `idInGame` INTEGER NOT NULL,
    `auth` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_idInGame_key`(`idInGame`),
    UNIQUE INDEX `User_auth_key`(`auth`),
    PRIMARY KEY (`idDatabase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Season` (
    `idSeason` INTEGER NOT NULL AUTO_INCREMENT,
    `season` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idSeason`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeasonStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goals` INTEGER NOT NULL,
    `assistences` INTEGER NOT NULL,
    `wins` INTEGER NOT NULL,
    `defeats` INTEGER NOT NULL,
    `matches` INTEGER NOT NULL,
    `fkUser` INTEGER NOT NULL,
    `fkSeason` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SeasonStatus` ADD CONSTRAINT `SeasonStatus_fkUser_fkey` FOREIGN KEY (`fkUser`) REFERENCES `User`(`idDatabase`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeasonStatus` ADD CONSTRAINT `SeasonStatus_fkSeason_fkey` FOREIGN KEY (`fkSeason`) REFERENCES `Season`(`idSeason`) ON DELETE RESTRICT ON UPDATE CASCADE;
