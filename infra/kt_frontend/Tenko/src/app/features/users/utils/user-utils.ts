
export function getDisplayName(firstname: string, lastname: string): string {
    const prepFirstname = firstname ? firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase() : '';
    const prepLastname = lastname ? lastname.toUpperCase() : '';
    return `${prepFirstname} ${prepLastname}`.trim()
}
