import React from 'react';
import { FaStar, FaParking, FaArrowRight } from 'react-icons/fa';
import classes from './DataSection.module.css';
import { MdShortcut } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const BookmarkSection = ({ bookmarkData }) => {

    const navigate = useNavigate();

    const goBookmarkPage = () => {
        navigate('/bookmark');
    }

    return (
        <div className={classes.section_box}>
        <h4 className={classes.section_title}>서비스</h4>

        <div className={classes.section_item}>
            <div className={classes.item_left}>
            <FaStar className={classes.item_icon} />
            <span className={classes.item_text}>내 즐겨찾기</span>
            </div>
            <span className={classes.item_right}>{bookmarkData?.totalCount ?? 0}개</span>
        </div>

        <div className={classes.section_item}>
            <div className={classes.item_left}>
            <FaParking className={classes.item_icon} />
            <span className={classes.item_text}>즐겨찾기 중 운영중인 주차장</span>
            </div>
            <span className={classes.item_right}>{bookmarkData?.openCount ?? 0}곳</span>
        </div>
        <div className={`${classes.section_item} ${classes.clickable}`} onClick={goBookmarkPage}>
            <div className={classes.item_left}>
            <MdShortcut className={classes.item_icon} />
            <span className={classes.item_text}>내 즐겨찾기 바로가기</span>
            </div>
            <FaArrowRight className={classes.item_arrow} />
        </div>
        </div>
    );
};

export default BookmarkSection;
