package com.security.comm;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class BaseBean {
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        // 获取Bean的所有方法
        Method[] methods = this.getClass().getMethods();
        // 方法名
        String methodName = null;
        String fieldName = null;
        try {
            // 遍历，取Getter方法
            for (Method method : methods) {
                methodName = method.getName();
                if (methodName.startsWith("get")) {
                    if ("getClass".equals(methodName)) {
                        continue;
                    }
                    fieldName = methodName.substring(3);
                    fieldName = fieldName.substring(0, 1).toLowerCase()
                            + fieldName.substring(1);
                    sb.append(fieldName + "=[" + method.invoke(this, null) + "] ");
                }
            }
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        sb.append("]");
        return sb.toString();
    }
}
