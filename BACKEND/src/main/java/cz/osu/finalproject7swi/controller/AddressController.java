package cz.osu.finalproject7swi.controller;

import cz.osu.finalproject7swi.model.dto.AddressDTO;
import cz.osu.finalproject7swi.model.entity.Address;
import cz.osu.finalproject7swi.model.entity.AppUser;
import cz.osu.finalproject7swi.service.AddressService;
import cz.osu.finalproject7swi.service.result.AddressSaveResult;
import cz.osu.finalproject7swi.util.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "http://localhost:4200")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

  @PostMapping
  public ResponseEntity<?> saveAddress(@RequestBody AddressDTO addressDto) {
    AppUser user = UserUtil.getCurrentUser();
    AddressSaveResult result = addressService.saveAddress(user, addressDto);

    // You need the actual Address object (you can modify your service to return it)
    Address savedAddress = addressService.findByUserAndAddress(user, addressDto);

    return switch (result) {
      case DUPLICATE -> ResponseEntity.status(HttpStatus.CONFLICT)
        .body("Tato adresa již existuje.");
      case SUCCESS -> ResponseEntity.ok(savedAddress); // send full address to frontend
      default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("Neznámá chyba.");
    };
  }


    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses() {
        AppUser user = (AppUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<AddressDTO> result = addressService.getUserAddresses(user);
        return ResponseEntity.ok(result);
    }
}
