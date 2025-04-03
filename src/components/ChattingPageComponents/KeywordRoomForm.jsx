import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatRoomByKeywordService, isParticipateChatRoomService,
    registerNewMemberToChatRoomService
 } from '../../api/ChatRoomService';
import classes from './KeywordRoomForm.module.css';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedValue(value);
        }, delay);

        return () => {
        clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const KeywordRoomForm = (props) => {

    const memberId = props.member.memberId;
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 400);
    const [results, setResults] = useState([]);
    const [displayedResults, setDisplayedResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [noResultsMessageVisible, setNoResultsMessageVisible] = useState(false);
    const [initialMessageVisible, setInitialMessageVisible] = useState(true);
    const observerRef = useRef(null);

    const participateChatHandler = async (chatRoom) => {

        const isParticipateResponse = await isParticipateChatRoomService(chatRoom.roomId,memberId);
        if (isParticipateResponse.success) {
            if (isParticipateResponse.data){
                props.onChatExecute(chatRoom);
            }else{
                const registerResponse = await registerNewMemberToChatRoomService(chatRoom.roomId,memberId);
                if (registerResponse.success) {
                    props.onChatExecute(registerResponse.data);
                }else{
                    const errorMessage = createRoomResponse.message;
                    toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            }
        }else{
            const errorMessage = createRoomResponse.message;
            toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsSubmit(false);
        }
    };  

    useEffect(() => {
        const fetchData = async () => {
            if (debouncedQuery.trim() === '') {
            setResults([]); 
            setDisplayedResults([]); 
            setNoResultsMessageVisible(false);
            setInitialMessageVisible(true);
            return;
            }
        
            setLoading(true);
            setError(null);
            setInitialMessageVisible(false);
            try {
            const chatRoomResponse = await getChatRoomByKeywordService(debouncedQuery);
            if (chatRoomResponse.success) {
                setResults(chatRoomResponse.data);
                setDisplayedResults(chatRoomResponse.data.slice(0, 20));
                setNoResultsMessageVisible(chatRoomResponse.data.length === 0); 
            } else {
                setError('검색 결과를 불러오는데 실패했습니다.');
            }
            } catch (err) {
            setError('검색 중 오류가 발생했습니다.');
            }
            setLoading(false);
        };
        fetchData();
    }, [debouncedQuery]);
    
    useEffect(() => {
        if (results.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
            if (entries[0].isIntersecting && displayedResults.length < results.length) {
                const nextPage = page + 1;
                setPage(nextPage);
                setDisplayedResults(results.slice(0, nextPage * 20));
            }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [results, displayedResults, page]);
    
      return (
        <div className={classes.searchContainer}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="채팅방 이름을 검색해주세요."
            className={classes.searchInput}
          />
          <div className={classes.resultsContainer}>
            {loading && <p className={classes.loadingText}>검색 중입니다...</p>}
            {error && <p className={classes.errorText}>{error}</p>}
            <AnimatePresence>
                {initialMessageVisible && (
                    <motion.p
                        key='noInput'
                        className={classes.noResultsText}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                    검색어를 입력해보세요!
                    </motion.p>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {!loading && !error && noResultsMessageVisible && (
                    <motion.p
                        key='noResult'
                        className={classes.noResultsText}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        검색 결과가 존재하지 않습니다.
                    </motion.p>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {!loading && !error && displayedResults.map((result, index) => (
                    <motion.div
                        onClick={() => participateChatHandler(result)}
                        key={result.roomId}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={classes.resultItem}
                    >
                        <div className={classes.placeName}>{result.chatTitle}</div>
                        <div className={classes.memberCount}>{result.memberCount}명 참여중</div>
                    </motion.div>
                ))}
            </AnimatePresence>
            <div ref={observerRef} />
          </div>
        </div>
    );
};

export default KeywordRoomForm;