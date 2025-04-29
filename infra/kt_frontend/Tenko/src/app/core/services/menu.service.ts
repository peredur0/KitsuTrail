import { Injectable } from "@angular/core";
import { Menu } from "../models/menu.model";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private menus: Menu[] = [
        {
            title: "Gestion des utilisateurs",
            display: true,
            links: [
                { label: "Utilisateurs", path: "users", disabled: false }
            ]
        },
        {
            title: "Gestion des fournisseurs",
            display: true,
            links: [
                { label: "Identités", path: "providers/idp", disabled: false },
                { label: "Services", path: "providers/sp", disabled: false }
            ]
        },
        {
            title: "Traitements des données",
            display: true,
            links: [
                { label: "Journal d'audit", path: "logs", disabled: true },
                { label: "Tableau de bord", path: "dashboard", disabled: true }
            ]
        }
    ];

    getMenu(): Menu[]{
        return [...this.menus];
    }

    getLabel(element: 'title'| 'subtitle', path: string): string{
        for (const menu of this.menus) {
            for (const link of menu.links){
                if ( !path ) {
                    return 'Bienvenue';
                }
                if ( link.path === path ) {
                    return element === 'title' ? menu.title : link.label;
                }
            }
        }
        throw new Error(`Section info not found for ${path}`);
    }
}