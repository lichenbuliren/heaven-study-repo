import { execSync } from "child_process";

const getChangedFiles = () => {
  return execSync("git diff --name-only HEAD^ HEAD")
    .toString()
    .split("\n")
    .filter(Boolean);
};

const findAffectedPackages = (files) => {
  // 实现基于文件变更的包影响分析
};

const main = () => {
  const changed = getChangedFiles();
  const affected = findAffectedPackages(changed);
  console.log(affected.join(" "));
};

main();
