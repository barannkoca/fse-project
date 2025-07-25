package com.restaurant.restaurant_api.Model;

import jakarta.persistence.*;
import jakarta.persistence.Table;

@Entity
@Table(name = "MENU_ITEM")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_item_id", nullable = false)
    private int menuItemId;
    @Column(name = "menu_item_name", nullable = false)
    private String menuItemName;
    @Column(name = "menu_item_desc")
    private String menuItemDesc;
    @Column(name = "menu_item_price", nullable = false)
    private int menuItemPrice;
    @Column(name = "menu_item_pic")
    private String menuItemPic;
    @Column(name = "menu_item_category")
    private String menuItemCategory;

    public MenuItem() {}

    public MenuItem(int menuItemId, String menuItemName, String menuItemDesc, int menuItemPrice, String menuItemPic, String menuItemCategory) {
        this.menuItemId = menuItemId;
        this.menuItemName = menuItemName;
        this.menuItemDesc = menuItemDesc;
        this.menuItemPrice = menuItemPrice;
        this.menuItemPic = menuItemPic;
        this.menuItemCategory = menuItemCategory;
    }

    public MenuItem(String menuItemName, String menuItemDesc, int menuItemPrice, String menuItemPic, String menuItemCategory) {
        this.menuItemName = menuItemName;
        this.menuItemDesc = menuItemDesc;
        this.menuItemPrice = menuItemPrice;
        this.menuItemPic = menuItemPic;
        this.menuItemCategory = menuItemCategory;
    }

    public int getMenuItemId() {
        return menuItemId;
    }

    public String getMenuItemName() {
        return menuItemName;
    }

    public String getMenuItemDesc() {
        return menuItemDesc;
    }

    public int getMenuItemPrice() {
        return menuItemPrice;
    }

    public String getMenuItemPic() {
        return menuItemPic;
    }

    public String getMenuItemCategory() {
        return menuItemCategory;
    }

    public void setMenuItemName(String menuItemName) {
        this.menuItemName = menuItemName;
    }

    public void setMenuItemDesc(String menuItemDesc) {
        this.menuItemDesc = menuItemDesc;
    }

    public void setMenuItemPrice(int menuItemPrice) {
        this.menuItemPrice = menuItemPrice;
    }

    public void setMenuItemPic(String menuItemPic) {
        this.menuItemPic = menuItemPic;
    }

    public void setMenuItemCategory(String menuItemCategory) {
        this.menuItemCategory = menuItemCategory;
    }

    @Override
    public String toString() {
        return "MenuItem{" +
                "menuItemId=" + menuItemId +
                ", menuItemName='" + menuItemName + '\'' +
                ", menuItemDesc='" + menuItemDesc + '\'' +
                ", menuItemPrice=" + menuItemPrice +
                ", menuItemPic='" + menuItemPic + '\'' +
                ", menuItemCategory='" + menuItemCategory + '\'' +
                '}';
    }
}
