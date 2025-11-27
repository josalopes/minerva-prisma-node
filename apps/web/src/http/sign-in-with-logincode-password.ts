import { api } from "./api-client";


interface SignInWithPasswordRequest {
    login: string,
    password: string,
}

interface SignInWithPasswordResponse {
    token: string,
}

export async function signInWithLoginCodePassword({
    login, password,
}: SignInWithPasswordRequest): Promise<SignInWithPasswordResponse> {
    const response = await api
        .post('sessions/code', {
            json: { 
                login, 
                password 
            },
    })
    .json<SignInWithPasswordResponse>()

    return response
}