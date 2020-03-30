package com.comm.file.dao;

import com.comm.file.data.CommFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ICommFileDao extends JpaRepository<CommFile, String>, JpaSpecificationExecutor<CommFile> {

    public CommFile findCommFileByApplyId(String applyId);

    public List<CommFile> findCommFilesByApplyId(String applyId);
}
