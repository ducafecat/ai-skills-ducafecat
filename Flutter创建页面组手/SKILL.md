---
name: "Flutter创建页面组手"
description: "Flutter 项目中创建页面"
---

# Flutter创建页面组手

按规则生成空页面脚手架代码。

## 执行步骤

1. 询问用户 [保存目录] 和 [业务名称]
2. 调用 create-page.js 脚本创建页面

```bash
node $SKILL_DIR/create-page.js <保存目录> <业务名称>
```

1. 按导报名称排序 lib/pages/index.dart
2. 通过 skills 系统消息通知 "猫哥Skills助手" "<业务名称>GetX页面创建完成"

## 生成规则

脚本会自动处理：

- 中文翻译成英文（英文直接使用）
- 命名转换（snake_case）
- 创建目录结构（lib/pages/<业务代码>/）
- 生成 view.dart、controller.dart、index.dart
