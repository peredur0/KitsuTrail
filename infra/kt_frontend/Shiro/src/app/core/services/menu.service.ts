import { Injectable } from "@angular/core";
import { Menu } from "../models/menu.model";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    menus: Menu[] = [
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
                { label: "Identités", path: "", disabled: true },
                { label: "Services", path: "", disabled: true }
            ]
        },
        {
            title: "Traitements des données",
            display: true,
            links: [
                { label: "Journal d'audit", path: "", disabled: true },
                { label: "Tableau de bord", path: "", disabled: true }
            ]
        }
    ];

    getMenu(): Menu[]{
        return [...this.menus];
    }

    getLabel(element: 'title'| 'subtitle', path: string): string{
        for (const menu of this.menus) {
            for (const link of menu.links){
                if (link.path === path) {
                    return element === 'title' ? menu.title : link.label
                }
            }
        }
        console.log(`Error: Failed to find label for ${path}`)
        return 'Inconnu'
    }
}