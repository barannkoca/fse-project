package com.restaurant.restaurant_api.Controller;

import com.restaurant.restaurant_api.Model.MenuItem;
import com.restaurant.restaurant_api.Model.Table;
import com.restaurant.restaurant_api.Service.MenuItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/MenuItems")
public class MenuItemController {

    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getMenuItems(
            @RequestParam(required = false) Integer menuItemId,
            @RequestParam(required = false) String menuItemName
    ) {
        if (menuItemId == null && menuItemName == null) {
            return new ResponseEntity<>(getMenuItemService().getAllMenuItems(), HttpStatus.OK);
        }
        else if (menuItemId == null) {
            return new ResponseEntity<>(getMenuItemService().getMenuItemByName(menuItemName), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(getMenuItemService().getMenuItemById(menuItemId), HttpStatus.OK);
        }
    }

    @GetMapping("/filter/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemByCategory(@PathVariable String category) {
        return new ResponseEntity<>(getMenuItemService().getMenuItemByCategory(category), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<MenuItem> postAMenuItem(@RequestBody MenuItem menuItem) {
        if (menuItem != null) {
            return new ResponseEntity<>(getMenuItemService().postMenuItem(menuItem), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new MenuItem(), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{menuItemId}")
    public ResponseEntity<Void> deleteAMenuItem(@PathVariable int menuItemId) {
        getMenuItemService().deleteMenuItemById(menuItemId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{menuItemId}")
    public ResponseEntity<MenuItem> putAMenuItem(@PathVariable int menuItemId, @RequestBody MenuItem menuItem) {
        if (menuItem != null) {
            return new ResponseEntity<>(getMenuItemService().putByMenuItemId(menuItemId, menuItem), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new MenuItem(), HttpStatus.BAD_REQUEST);
    }

    public MenuItemService getMenuItemService() {
        return menuItemService;
    }
}
