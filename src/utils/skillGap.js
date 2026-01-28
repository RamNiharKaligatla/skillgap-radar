export function computeSkillGap(required, known){
    return required.filter(skill => !known.includes(skill))
}