import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function configureSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('TesteJudit')
        .setDescription('API de teste Judith')
        .setVersion('1.0')
        .addTag('processos', 'endpoints relacionados aos processos')
        .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, document)
}