package com.restaurant.restaurant_api.Service;

import com.restaurant.restaurant_api.Model.MenuItem;
import com.restaurant.restaurant_api.Repository.MenuItemRepository;
import com.restaurant.restaurant_api.Validation;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final Validation validation;

    public MenuItemService(MenuItemRepository menuItemRepository, Validation validation) {
        this.menuItemRepository = menuItemRepository;
        this.validation = validation;
    }

    public List<MenuItem> getAllMenuItems() {
        return getMenuItemRepository().findAll();
    }

    public List<MenuItem> getMenuItemByName(String menuItemName) {
        MenuItem menuItem = getMenuItemRepository().findByMenuItemName(menuItemName);
        if (menuItem != null) {
            return List.of(menuItem);
        }
        throw new NoSuchElementException("menuItem is not found");
    }

    public List<MenuItem> getMenuItemById(int menuItemId) {
        if (getValidation().isIdValid(menuItemId)) {
            MenuItem menuItem = getMenuItemRepository().findById(menuItemId);
            if (menuItem == null) throw new NoSuchElementException("menuItem is not found");
            return List.of(menuItem);
        }
        throw new IllegalArgumentException("menuItemId cannot be equal or lower than 0");
    }

    public List<MenuItem> getMenuItemByCategory(String menuItemCategory) {
        return getMenuItemRepository().findByMenuItemCategory(menuItemCategory);
    }

    public MenuItem postMenuItem(MenuItem menuItem) {
        return getMenuItemRepository().save(menuItem);
    }

    public void deleteMenuItemById(int menuItemId) {
        if (getValidation().isIdValid(menuItemId)) {
            if (getMenuItemRepository().existsById(menuItemId)) {
                getMenuItemRepository().deleteById(menuItemId);
                return;
            }
            throw new NoSuchElementException("menuItem not found");
        }
        throw new IllegalArgumentException("menuItemId cannot be equal or lower than 0");
    }

    public MenuItem putByMenuItemId(int menuItemId, MenuItem menuItem) {
        if (getValidation().isIdValid(menuItemId)) {
            MenuItem oldMenuItem = getMenuItemRepository().findById(menuItemId);
            if (oldMenuItem != null) {
                oldMenuItem.setMenuItemCategory(menuItem.getMenuItemCategory());
                oldMenuItem.setMenuItemName(menuItem.getMenuItemName());
                oldMenuItem.setMenuItemDesc(menuItem.getMenuItemDesc());
                oldMenuItem.setMenuItemPrice(menuItem.getMenuItemPrice());
                oldMenuItem.setMenuItemPic(menuItem.getMenuItemPic());
                return getMenuItemRepository().save(oldMenuItem);
            }
            throw new NoSuchElementException("menuItem not found");
        }
        throw new IllegalArgumentException("menuItemId cannot be equal or lower than 0");
    }

    public MenuItemRepository getMenuItemRepository() {
        return menuItemRepository;
    }

    public Validation getValidation() {
        return validation;
    }

}
