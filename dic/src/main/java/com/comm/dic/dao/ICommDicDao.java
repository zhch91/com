package com.comm.dic.dao;

import com.comm.dic.data.CommDic;
import com.comm.dic.data.CommDicKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ICommDicDao extends JpaRepository<CommDic, CommDicKey> {

    List<CommDic> findByTypeAndInUseOrderBySeq(String type, String inUse);
}
