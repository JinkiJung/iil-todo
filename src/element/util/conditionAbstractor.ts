// getConditionText is a function that takes a ConditionDto and returns a string. It is defined in src/element/util/conditionAbstractor.tsx:
import { ConditionDto } from "../../ill-repo-client";

export function getConditionText(condition: ConditionDto): string {
     return condition.name!;
}
