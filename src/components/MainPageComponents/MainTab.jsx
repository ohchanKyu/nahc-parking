import classes from "./MainTab.module.css";
import { useNavigate } from "react-router-dom";
import { BsBookmarkStarFill } from "react-icons/bs";
import { FaParking } from "react-icons/fa";
import { motion } from "framer-motion";
import { IoIosChatbubbles } from "react-icons/io";

const MainTab = (props) => {
    
  const navigate = useNavigate();
  
  const goChattingPage = () => {
      navigate('/chat');
  };

  const goFavoritePage = () => {
      navigate('/bookmark');
  };

    const goAroundSearchPage = () => {
        const params = new URLSearchParams({
            latitude : props.location.latitude,
            longitude: props.location.longitude
        }).toString();
        navigate(`/around?${params}`);
    };
    
    const hoverEffect = {
        scale : 1.1
    }
    return (
        <div className={classes.container}>
            <ul className={classes.button_container}>
                <li key="me" className={classes.favorite}>
                        <motion.button
                            onClick={goChattingPage}
                            whileHover={hoverEffect}>
                            <IoIosChatbubbles style={{ fontSize:'14px', marginRight:'5px'}}/>  채팅 참여
                        </motion.button>
                </li>
                <li key="favorite" className={classes.favorite}>
                    <motion.button
                        onClick={goFavoritePage}
                        whileHover={hoverEffect}> 
                        <BsBookmarkStarFill className={classes.favorite_icon}/> 즐겨 찾기
                    </motion.button>
                </li>
                <li key="around" className={classes.around}>
                    <motion.button
                        onClick={goAroundSearchPage}
                        whileHover={hoverEffect}>
                        <FaParking className={classes.around_icon}/> 주변 탐색
                    </motion.button>
                </li>
            </ul>
        </div>
    );
};

export default MainTab;