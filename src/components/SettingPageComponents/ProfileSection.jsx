import React from 'react';
import classes from "./ProfileSection.module.css";

const ProfileSection = ({ memberData }) => {

    return (
        <div className={classes.main_section}>
            <div className={classes.profile_box}>
                <div className={classes.profile_header}>
                <div className={classes.profile_image} />
                <div>
                    <div className={classes.profile_name}>{memberData.name}님</div>
                    <div className={classes.profile_email}>{memberData.email}</div>
                    <div className={classes.profile_id}>아이디: {memberData.userId}</div>
                    <div className={classes.profile_date}>가입일: {memberData.createTime.split("T")[0]}</div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;