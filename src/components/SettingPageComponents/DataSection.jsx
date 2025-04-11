import React from 'react';
import {
  FaComments,     
  FaThumbtack,      
  FaEnvelopeOpen,  
  FaArrowRight
} from 'react-icons/fa';
import { MdShortcut } from 'react-icons/md';
import classes from './DataSection.module.css';
import { useNavigate } from 'react-router-dom';

const DataSection = ({ chatRoomData }) => {

  const navigate = useNavigate();

  const goChattingPage = () => {
    navigate('/chat');
  };

  return (
    <div className={classes.section_box}>
      <h4 className={classes.section_title}>내 데이터 관리</h4>

      <div className={classes.section_item}>
        <div className={classes.item_left}>
          <FaComments className={classes.item_icon} />
          <span className={classes.item_text}>내 채팅방</span>
        </div>
        <span className={classes.item_right}>{chatRoomData?.totalCount ?? 0}개</span>
      </div>

      <div className={classes.section_item}>
        <div className={classes.item_left}>
          <FaThumbtack className={classes.item_icon} />
          <span className={classes.item_text}>내 고정 채팅방</span>
        </div>
        <span className={classes.item_right}>{chatRoomData?.pinCount ?? 0}개</span>
      </div>

      <div className={classes.section_item}>
        <div className={classes.item_left}>
          <FaEnvelopeOpen className={classes.item_icon} />
          <span className={classes.item_text}>내 읽지 않은 메시지</span>
        </div>
        <span className={classes.item_right}>{chatRoomData?.unreadCount ?? 0}개</span>
      </div>

      <div className={`${classes.section_item} ${classes.clickable}`} onClick={goChattingPage}>
        <div className={classes.item_left}>
          <MdShortcut className={classes.item_icon} />
          <span className={classes.item_text}>내 채팅방 바로가기</span>
        </div>
        <FaArrowRight className={classes.item_arrow} />
      </div>
    </div>
  );
};

export default DataSection;
