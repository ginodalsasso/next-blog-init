// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
    return (
        <div className="flex justify-center mt-10">
            <SignIn />
        </div>
    );
};

export default SignInPage;
