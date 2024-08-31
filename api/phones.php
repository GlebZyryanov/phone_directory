<?php
require 'config.php';
header('Access-Control-Allow-Origin: *'); // Разрешаем запросы с любых источников
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); // Разрешаем методы
header('Access-Control-Allow-Headers: Content-Type'); // Разрешаем заголовок Content-Type

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        
        try{
            $data = json_decode(file_get_contents('php://input'), true);
            
            
            $employee_id = $data['employee_id'];
            $stmt = $pdo->prepare("SELECT * FROM phone_numbers WHERE employee_id = :employee_id");
            $stmt->execute(['employee_id' => $employee_id]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        
        }catch(PDOException $e){
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        
        break;
    
        case 'POST':
           
            try{
                $data = json_decode(file_get_contents('php://input'), true);
                
                    $stmt = $pdo->prepare("INSERT INTO phone_numbers (employee_id, phone_number) VALUES (:employee_id, :phone_number)");
                    $stmt->execute(['employee_id' => $data['employee_id'], 'phone_number' => $data['phone_number']]);
                    echo json_encode(['id' => $pdo->lastInsertId()]);
                
            }catch(PDOException $e){
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
            break;
    
            case 'PUT':
                try{
                    $data = json_decode(file_get_contents('php://input'), true);
                
                    $stmt = $pdo->prepare("UPDATE phone_numbers SET phone_number = :phone_number WHERE id = :id");
                    $stmt->execute(['phone_number' => $data['phone_number'], 'id' => $data['id']]);
                    echo json_encode(['id' => $data['id'], 'phone_number' => $data['phone_number']]);
                
                }catch(PDOException $e){
                    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
                }
                break;

    case 'DELETE':
        //$id = $_GET['id'];
        try{
            $data = json_decode(file_get_contents('php://input'), true);
        
            $id = $data['id'];
            $stmt = $pdo->prepare("DELETE FROM phone_numbers WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['status' => 'success']);
        
        }catch(PDOException $e){
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;
}
