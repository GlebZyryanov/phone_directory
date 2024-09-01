<?php
require 'config.php';
header('Access-Control-Allow-Origin: *'); // Разрешаем запросы с любых источников
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); // Разрешаем методы
header('Access-Control-Allow-Headers: Content-Type'); // Разрешаем заголовок Content-Type

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM employees");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
    
    case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            try{
                if ($data && isset($data['name'], $data['position'])) { // Проверка наличия данных
                    $stmt = $pdo->prepare("INSERT INTO employees (name, position) VALUES (:name, :position)");
                    $stmt->execute(['name' => $data['name'], 'position' => $data['position']]);
                    $id = $pdo->lastInsertId();
                    echo json_encode(['id'=> $id, 'name' => $data['name'], 'position' => $data['position']]);
                } else {
                    echo json_encode(['error' => 'Invalid input']);
                }
            }catch(PDOException $e){
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
            break;
    
    case 'PUT':
                $data = json_decode(file_get_contents('php://input'), true);
                try{
                    if ($data && isset($data['id'], $data['name'], $data['position'])) {
                        $stmt = $pdo->prepare("UPDATE employees SET name = :name, position = :position WHERE id = :id");
                        $stmt->execute(['name' => $data['name'], 'position' => $data['position'], 'id' => $data['id']]);
                        echo json_encode(['id' => $data['id'], 'name' => $data['name'], 'position' => $data['position']]);
                    } else {
                        echo json_encode(['error' =>  'Invalid input']);
                    }
                }catch(PDOException $e){
                    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
                }
                break;

    case 'DELETE':
        
       try{
        $data = json_decode(file_get_contents('php://input'), true);
        if($data && isset($data['id'])){
            $id = $data['id'];
        $stmt = $pdo->prepare("DELETE FROM employees WHERE id = :id");
        $stmt->execute(['id' => $id]);
        echo json_encode(['status' => 'success']);
        }else{
            echo json_encode(['error' => 'Invalid input']);
        }
       }catch(PDOException $e){
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
       }
        break;
}
