import type { FastifyReply, FastifyRequest } from 'fastify';
import { format } from 'date-fns';

function getStatusColor(status: number) {
    const color =
        status >= 500 ? 31 // vermelho
            : status >= 400 ? 33 // amarelo
                : status >= 300 ? 36 // ciano
                    : status >= 200 ? 32 // verde
                        : 0; // sem cor

    return `\x1b[${color}m${status}\x1b[0m`;
}

export async function logger(request: FastifyRequest, reply: FastifyReply) {
    console.log(
        `[${request.ip}] ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')} - [${getStatusColor(reply.statusCode)}] ${request.method} ${request.url} [${reply.elapsedTime.toFixed(3)} ms]`
    );

    return reply;
}
