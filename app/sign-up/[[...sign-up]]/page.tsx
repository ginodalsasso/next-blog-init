// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
    return (
        <div className="flex justify-center mt-10">
            <SignUp />
        </div>
    );
};

export default SignUpPage;
