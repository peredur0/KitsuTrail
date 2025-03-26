import { Injectable } from "@angular/core";
import { Menu } from "../models/menu.model";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    menu: Menu[] = [
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
                { label: "Identité", path: "", disabled: true },
                { label: "Service", path: "", disabled: true }
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
        return [...this.menu];
    }
}