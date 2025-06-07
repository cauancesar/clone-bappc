export interface UserInterface {
    id: number
    cpf: string
    email: string
    servidor: string
    user: string
    avatar: AvatarInterface
    role: Role[]
    salt: string
    senha: string
}

export enum Role {
    USER = 'user',
    ADMIN = 'admin'
}

export interface AvatarInterface {
    avatar: string
    background: string
    frame: string
}
