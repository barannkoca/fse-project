package com.restaurant.restaurant_api.Repository;

import com.restaurant.restaurant_api.Model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {
    MenuItem findByMenuItemName(String menuItemName);

    MenuItem findById(int menuItemId);

    List<MenuItem> findByMenuItemCategory(String menuItemCategory);
}

