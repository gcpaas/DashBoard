package com.gccloud.dashboard.core.service.impl;

import com.gccloud.dashboard.core.vo.TreeVo;
import com.gccloud.dashboard.core.service.ITreeService;
import com.google.common.collect.Lists;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author liuchengbiao
 * @date 2020-07-22 14:34
 */
@Service("dashboardTreeService")
public class TreeServiceImpl implements ITreeService {

    private static final String SUPER_PARENT_ID = "0";

    @Override
    public void transToTree(List<? extends TreeVo> voList) {
        Map<String, TreeVo> voMap = new HashMap<>();
        voList.forEach(vo -> voMap.put(vo.getId(), vo));
        // 转为树
        for (TreeVo vo : voList) {
            if (SUPER_PARENT_ID.equals(vo.getParentId())) {
                continue;
            }
            TreeVo parentVo = voMap.get(vo.getParentId());
            if (parentVo == null) {
                continue;
            }
            vo.setParentName(parentVo.getName());
            List<TreeVo> children = parentVo.getChildren();
            if (children == null) {
                children = Lists.newArrayList();
                parentVo.setChildren(children);
            }
            children.add(vo);
        }
    }
}
