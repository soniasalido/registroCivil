-- CreateTable
CREATE TABLE `RegistroCivil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clavePrimaria` VARCHAR(191) NOT NULL,
    `registro` VARCHAR(191) NOT NULL DEFAULT 'xxxx',
    `seccion` VARCHAR(191) NOT NULL,
    `tomo` INTEGER NOT NULL,
    `numeroPagina` INTEGER NOT NULL,
    `lado` VARCHAR(191) NOT NULL,
    `notasMarginales` VARCHAR(191) NULL DEFAULT '1',
    `nombre` VARCHAR(191) NOT NULL,
    `primerApellido` VARCHAR(191) NOT NULL,
    `segundoApellido` VARCHAR(191) NULL,
    `tipoDocumento` VARCHAR(191) NULL,
    `documento` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NULL,
    `observaciones` VARCHAR(191) NULL,
    `urlPDF` VARCHAR(191) NULL,

    UNIQUE INDEX `RegistroCivil_clavePrimaria_key`(`clavePrimaria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
