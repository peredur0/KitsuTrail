import { Injectable } from "@angular/core";
import { Menu } from "../models/menu.model";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    menu: Menu[] = [
        {
            title: "utilisateurs",
            display: true,
            links: [
                { label: "utilisateurs", path: "/users", disabled: false }
            ]
        },
        {
            title: "fournisseurs",
            display: true,
            links: [
                { label: "identité", path: "", disabled: true },
                { label: "service", path: "", disabled: true }
            ]
        },
        {
            title: "Data",
            display: false,
            links: [
                { label: "journal d'audit", path: "", disabled: true },
                { label: "tableau de bord", path: "", disabled: true }
            ]
        }
    ];

    getMenu(): Menu[]{
        return [...this.menu];
    }
}