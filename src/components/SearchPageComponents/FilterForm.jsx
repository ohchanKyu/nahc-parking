import React, { useState, useEffect } from 'react';
import classes from './FilterForm.module.css';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getTypesService, getRegionCodesService, getParkingLotByFilterService } from '../../api/ParkingLotService';
import FilterResult from './FilterResult';

const FilterForm = () => {

  const [types,setTypes] = useState([]);
  const [regionCodes,setRegionCodes] = useState([]);
  const [result,setResult] = useState([]);
  const [isSubmitResult,setIsSubmitResult] = useState(false);
  const [isSubmit,setIsSubmit] = useState(false);

  const [formData, setFormData] = useState({
    type : '',
    regionCode: '',
    isOpen : false,
    isFree: false,
    isCurrent: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    setIsSubmit(true);
    e.preventDefault();
    if (!formData.regionCode) {
      toast.warning("지역 코드를 선택해주세요.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
      }); 
      setIsSubmit(false);
      return;
    }
    const parkingLotResponse = await getParkingLotByFilterService(formData);
    setResult(parkingLotResponse.data);
    setIsSubmitResult(true);
    setFormData({
      type : '',
      regionCode: '',
      isOpen : false,
      isCurrent: false,
      isFree: false,
    });
    setIsSubmit(false);
  };

  useEffect(() => {

    const initialHandler = async () => {
      const typesResponse = await getTypesService();
      const regionCodeResponse = await getRegionCodesService();
      setTypes(typesResponse.data);
      setRegionCodes(regionCodeResponse.data);
    };
    initialHandler();
  },[])
  return (
    <>
      <motion.form 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className={classes.filterForm} onSubmit={handleSubmit}>
        <div className={classes.formGroup}>
          <label htmlFor="regionCode">지역 선택<span className={classes.required}>*</span></label>
          <select 
            id="regionCode" 
            name="regionCode" 
            value={formData.regionCode} 
            onChange={handleChange} 
            className={classes.inputField}
          >
            <option value="">지역코드를 선택해주세요.</option>
            {regionCodes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="type">종류 선택</label>
          <select 
            id="type" 
            name="type" 
            value={formData.type} 
            onChange={handleChange} 
            className={classes.inputField}
          >
            <option value="">주차장 종류를 선택해주세요</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className={classes.toggleGroup}>
          <label className={classes.toggleLabel}>
            <span>운영중</span>
            <input 
              type="checkbox" 
              name="isOpen" 
              checked={formData.isOpen} 
              onChange={handleToggle} 
              className={classes.toggleSwitch}
            />
          </label>
          <label className={classes.toggleLabel}>
            <span>무료</span>
            <input 
              type="checkbox" 
              name="isFree" 
              checked={formData.isFree} 
              onChange={handleToggle} 
              className={classes.toggleSwitch}
            />
          </label>
          <label className={classes.toggleLabel}>
            <span>현재 대수</span>
            <input 
              type="checkbox" 
              name="isCurrent" 
              checked={formData.isCurrent} 
              onChange={handleToggle} 
              className={classes.toggleSwitch}
            />
          </label>
        </div>
        <motion.button 
          disabled={isSubmit}
          whileHover={{ scale : 1.05 }}
          type="submit" className={classes.submitButton}>{isSubmit ? '검색중...' : '검색하기'}</motion.button>
      </motion.form>
      {isSubmitResult && <FilterResult isSubmit={isSubmitResult} parkingLot={result}/>}
    </>
  );
};

export default FilterForm;
