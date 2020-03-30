package com.comm.file.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 时间工具类
 * 
 * @author shgtch
 * @date 2011-5-10
 */
public class DateUtil {
	/**
	 * 获取YYYY格式
	 * 
	 * @return
	 */
	public static String getYear() {
		SimpleDateFormat sdfYear = new SimpleDateFormat("yyyy");
		return sdfYear.format(new Date());
	}

	/**
	 * 获取YYYY-MM-DD格式
	 * 
	 * @return
	 */
	public static String getDay() {
		SimpleDateFormat sdfDay = new SimpleDateFormat("yyyy-MM-dd");
		return sdfDay.format(new Date());
	}

	/**
	 * 获取YYYYMMDD格式
	 * 
	 * @return
	 */
	public static String getDay8() {
		SimpleDateFormat sdfDay8 = new SimpleDateFormat("yyyyMMdd");
		return sdfDay8.format(new Date());
	}
	/**
	 * 获取YYYY-MM-DD hh:mm:ss格式
	 * 
	 * @return
	 */
	public static String getTime() {
		SimpleDateFormat sdfTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdfTime.format(new Date());
	}
	
	/**
	 * 获取YYYY-MM格式
	 * @return
	 */
	public static String getMonth() {
		SimpleDateFormat sdfMonth = new SimpleDateFormat("yyyy-MM");
		return sdfMonth.format(new Date());
	}
	
	/**
	 * 获取YYYY-MM格式的前一月
	 * @param today
	 * @return 前一月
	 */
	public static String getLastmonth(String today){
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM"); 
		Date date;
		try {
			date = sdf.parse(today);
			Calendar calendar = Calendar.getInstance(); 
			calendar.setTime(date); 
			calendar.add(Calendar.MONTH, -1);   //得到前一月
			String  lastmonth
			= new SimpleDateFormat("yyyy-MM").format(calendar.getTime());
			return lastmonth;
		} catch (ParseException e) {
			e.printStackTrace();
			return null; 
		}
	}
	
	/**
	 * 获取YYYY-MM格式的后一月
	 * @param today
	 * @return 后一月
	 */
	public static String getNextMonth(String today){
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM"); 
		Date date;
		try {
			date = sdf.parse(today);
			Calendar calendar = Calendar.getInstance(); 
			calendar.setTime(date); 
			calendar.add(Calendar.MONTH, +1);   //得到后一月
			String  nextMonth
			= new SimpleDateFormat("yyyy-MM").format(calendar.getTime());
			return nextMonth;
		} catch (ParseException e) {
			e.printStackTrace();
			return null; 
		}
	}

	/**
	* @Title: compareDate
	* @Description: TODO(日期比较，如果s>=e 返回true 否则返回false)
	* @param s
	* @param e
	* @return boolean  
	* @throws
	* @author luguosui
	 */
	public static boolean compareDate(String s, String e) {
		if(fomatDate(s)==null||fomatDate(e)==null){
			return false;
		}
		return fomatDate(s).getTime() >=fomatDate(e).getTime();
	}

	/**
	 * 格式化日期
	 * 
	 * @return
	 */
	public static Date fomatDate(String date) {
		DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
		try {
			return fmt.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 校验日期是否合法
	 * 
	 * @return
	 */
	public static boolean isValidDate(String s) {
		DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
		try {
			fmt.parse(s);
			return true;
		} catch (Exception e) {
			// 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
			return false;
		}
	}
	public static int getDiffYear(String startTime,String endTime) {
		DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
		try {
			long aa=0;
			int years=(int) (((fmt.parse(endTime).getTime()-fmt.parse(startTime).getTime())/ (1000 * 60 * 60 * 24))/365);
			return years;
		} catch (Exception e) {
			// 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
			return 0;
		}
	}
	
	/**
	 * 获取YYYYMMDDhhmmss格式
	 * @return
	 */
	public static String getTime14() {
		SimpleDateFormat sdfTime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		return sdfTime14.format(new Date());
	}
	/**
	 * 获取YYYY-MM-DD hh:mm:ss格式
	 * @return
	 */
	public static String getTime19() {
		SimpleDateFormat sdfTime19 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdfTime19.format(new Date());
	}
	
	/**
	 * 获取YYYYMMDDhhmmssSSS格式
	 * @return
	 */
	public static String getSSSTime() {
		SimpleDateFormat sdfTimeSSS = new SimpleDateFormat("yyyyMMddHHmmssSSS");
		return sdfTimeSSS.format(new Date());
	}
	
	/**
	 * 获取YYYY-MM-DD格式
	 * @return
	 */
	public static String getDay10() {
		SimpleDateFormat sdfDay10 = new SimpleDateFormat("yyyy-MM-dd");
		return sdfDay10.format(new Date());
	}
	
	/**
	 * 获取YYYY-MM格式
	 * @return
	 */
	public static String getMonth7() {
		SimpleDateFormat sdfMonth7 = new SimpleDateFormat("yyyy-MM");
		return sdfMonth7.format(new Date());
	}
	
	/**
	 * 获取YYYYMM格式
	 * @return
	 */
	public static String getMonth6() {
		SimpleDateFormat sdfMonth6 = new SimpleDateFormat("yyyyMM");
		return sdfMonth6.format(new Date());
	}
	
	
	/**
	 * 获取YYYY-MM-DD hh:mm格式
	 * @return
	 */
	public static String getTime16() {
		SimpleDateFormat sdfTime16 = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		return sdfTime16.format(new Date());
	}
	
	/**
	 * 获取YYYYMMDD hh:mm:ss格式
	 * @return
	 */
	public static String getTime17() {
		SimpleDateFormat sdfTime17 = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
		return sdfTime17.format(new Date());
	}
	/**
	 * 获取YYYYMMDD hh:mm:ss格式
	 * @return
	 */
	public static String getPreDay8() {
		SimpleDateFormat sdfDay8 = new SimpleDateFormat("yyyyMMdd");
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, -1);    //得到前一天
		Date date = calendar.getTime();
		return sdfDay8.format(date);
	}
}
