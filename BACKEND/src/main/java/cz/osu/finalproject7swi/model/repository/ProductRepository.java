package cz.osu.finalproject7swi.model.repository;

import cz.osu.finalproject7swi.model.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByCategory_Id(Long categoryId);
  @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
  Page<Product> searchProducts(@Param("name") String name, Pageable pageable);
  @Query(
    value = "SELECT * FROM product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY LOWER(p.name) ASC",
    countQuery = "SELECT COUNT(*) FROM product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))",
    nativeQuery = true
  )
  Page<Product> searchProductsByNameAsc(@Param("name") String name, Pageable pageable);

  @Query(
    value = "SELECT * FROM product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY LOWER(p.name) DESC",
    countQuery = "SELECT COUNT(*) FROM product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))",
    nativeQuery = true
  )
  Page<Product> searchProductsByNameDesc(@Param("name") String name, Pageable pageable);}
