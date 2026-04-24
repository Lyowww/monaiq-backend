export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    deviceName: string;
}
export declare class LoginDto {
    email: string;
    /** Login accepts any non-empty secret; strength is enforced on register only. */
    password: string;
    deviceName: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
