<?php

namespace OpenEMR;

/**
 * Check if the server's PHP version is compatible with OpenEMR.
 *
 * Note that this will only be used within setup.php, sql_upgrade.php,
 * sql_patch.php, acl_upgrade.php, admin.php, and globals.php.
 *
 * @package OpenEMR
 * @author  Matthew Vita <matthewvita48@gmail.com>
 * @link    http://www.open-emr.org
 * @copyright Copyright (c) 2017 Matthew Vita
 */
class Checker {
    private static $minimumPhpVersion = "5.4.0";

    private static function xlDelegate($value) {
        if (function_exists("xl")) {
            return xl($value);
        }

        return $value;
    }

    /**
     * Checks to see if minimum PHP version is met.
     *
     * @return bool | warning string
     */
    public static function checkPhpVersion() {
        $phpCheck = self::isPhpSupported();
        $response = "";

        if (!$phpCheck) {
            $response .= self::xlDelegate("PHP version needs to be at least") . " " . self::$minimumPhpVersion . ".";
        } else {
            $response = true;
        }

        return $response;
    }

    /**
     * Checks to see if minimum PHP version is met.
     *
     * @return bool
     */
    private static function isPhpSupported() {
        return version_compare(phpversion(), self::$minimumPhpVersion, ">=");
    }
}
