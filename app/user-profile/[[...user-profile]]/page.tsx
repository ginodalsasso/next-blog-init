import { UserProfile } from "@clerk/nextjs";
import React from "react";

const Profile = () => {
    return (
        <div className="flex justify-center mt-10">
            <UserProfile />
        </div>
    );
};

export default Profile;
