import React, { useState }  from "react";
import classes from "./ButtonSection.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logoutService, deleteMemberService } from "../../api/MemberService";
import { toast } from "react-toastify";
import Modal from "../../layout/Modal";
import LoadingModal from "../../layout/LoadingModal";

const ButtonSection = ({ loginCtx, memberData }) => {

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDelete,setIsDelete] = useState(false);

    const handleDeleteAccount = () => {
        setIsModalOpen(true);
    };

    const handleLogout = async () => {
        const logoutResponseData = await logoutService();
        if (logoutResponseData.success){
            toast.success("로그아웃에 성공하셨습니다.", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }else{
            toast.error("로그아웃에 실패하셨습니다. \n 강제로 로그아웃합니다.", {
            position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        loginCtx.logoutUser();
        navigate('/auth');
    };

    const confirmDelete = async () => {
        setIsModalOpen(false);
        setIsDelete(true);
        const logoutResponseData = await logoutService();
        if (logoutResponseData.success){
            const deleteResponseData = await deleteMemberService(loginCtx.memberId);
            if (deleteResponseData.success){
                toast.success("계정이 탈퇴 처리되었습니다.", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setIsDelete(false);
                navigate('/auth');
            }
            loginCtx.logoutUser();
        }else{
            toast.warning("일시적 오류입니다. \n 다시 로그인 후 진행해주세요.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        setIsDelete(false);
    };

    return (
        <div className={classes.button_box}>
            {isDelete && <LoadingModal/>}
            <motion.button 
                whileHover={{ scale : 1.05 }}
                className={classes.logout_btn} onClick={handleLogout}>
                로그아웃
            </motion.button>
            <motion.button 
                whileHover={{ scale : 1.05 }}
                className={classes.delete_btn} onClick={handleDeleteAccount}>
                회원 탈퇴
            </motion.button>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <div className={classes.modal_content}>
                        <h2 className={classes.modal_title}>회원 탈퇴 확인</h2>
                        <p className={classes.text}>
                            정말로 탈퇴하시겠습니까? <br/>
                            탈퇴하시면 이용중인 서비스가 폐쇄되며 <br/>
                            모든 데이터는 복구 불가입니다.
                        </p>
                        <div className={classes.info_box}>
                            <p className={classes.info}><strong>이름:</strong> {memberData.name}</p>
                            <p className={classes.info}><strong>이메일:</strong> {memberData.email}</p>
                        </div>
                        <ul className={classes.check_list}>
                            <li className={classes.check_one}>
                                채팅방, 채팅 기록, 즐겨찾기, 프로필 등 모든 정보가 삭제됩니다.
                            </li>
                            <li className={classes.check_two}>
                                이전 정보는 모두 삭제되며 필요한 데이터는 미리 백업을 해주세요.
                            </li>
                        </ul>
                        <div className={classes.modal_btns}>
                            <button className={classes.confirm_btn} onClick={confirmDelete}>탈퇴하기</button>
                            <button className={classes.cancel_btn} onClick={() => setIsModalOpen(false)}>취소하기</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );

};

export default ButtonSection;