import { NestFactory } from '@nestjs/core'
import { Logger, VersioningType } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { getConfig, IS_DEV } from './utils'
export const config = getConfig()
const PORT = config.PORT || 4000
const PREFIX = config.PREFIX || '/'

async function bootstrap() {
  const logger: Logger = new Logger('main.ts')
  const app = await NestFactory.create(AppModule, {
    // 开启日志级别打印
    logger: IS_DEV ? ['log', 'debug', 'error', 'warn'] : ['error', 'warn'],
  })
  // swagger
  const config = new DocumentBuilder()
    .setTitle('rbac api')
    .setDescription('The rbac API description')
    .setVersion('1.0')
    .addTag('rbac')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  //允许跨域请求
  app.enableCors()
  // 设置请求前缀
  app.setGlobalPrefix(PREFIX)
  await app.listen(PORT, () => {
    logger.log(`Server running on http://localhost:${PORT}/${PREFIX}`)
  })
}

bootstrap()
